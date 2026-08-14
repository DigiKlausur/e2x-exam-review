import {config} from "../globals";
import {nodeCron} from "node-cron";
import {IExam, IExamBase} from "../interfaces/IExam";
import {promises as fs, Stats} from "fs";
import * as path from "path";
import {semesterToShorthand, toFsSafeString, userToDisplayName} from "../util/stringFormatting";
import {AnswerSheet} from "../models/AnswerSheet";
import {IAnswerSheet, IFile} from "../interfaces";
import {Exam} from "../models/Exam";
import {IUserBase} from "../interfaces/IUser";
import {deleteExamById} from "./managementController";

const META_FILE_NAME = "meta.json";

async function handleAutomaticArchiving(){
    const exams: IExam[] = await fetchExamsToArchive();
    let successfulArchivingJobs: number = 0;
    console.log(`starting automatic archiving process: ${exams.length} exams need to be archived`);
    for (const exam of exams) {
        await archiveExam(exam)
            .then(() => successfulArchivingJobs++)
            .catch(err => console.error(`failed to archive exam ${exam._id} (${exam.title}, ${semesterToShorthand(exam.semester)}, ${userToDisplayName(exam.primaryExaminer as unknown as IUserBase)})`, err));
    }
    if(exams.length > 0) console.log(`the archiving process has finished ${successfulArchivingJobs}/${exams.length} exams have been archived successfully`);
}

function fetchExamsToArchive(): Promise<IExam[]>{
    return Exam.find({date: {$lte: getAutomaticArchivingStartDate().toISOString()}})
        .lean()
        .populate<IExam>(['primaryExaminer', 'secondaryExaminer'])
        .exec();
}

function getAutomaticArchivingStartDate(): Date {
    const date = new Date();
    date.setDate(date.getDate() - (config.archiving.automaticArchivingPeriodDays as number));
    return date;
}

export function setupAutomaticArchivingCronJob():void {
    if(typeof config.archiving.automaticArchivingPeriodDays !== 'number' || !Number.isFinite(config.archiving.automaticArchivingPeriodDays) || config.archiving.automaticArchivingPeriodDays <= 0) return;

    const timeParts = config.archiving.automaticArchivingTime.split(':').map((str: string, index: number) => index === 2 && !str ? 0 : parseInt(str));
    const [hours, minutes, seconds]: (number|undefined)[] = timeParts;

    if(timeParts.length < 2 || timeParts.length > 3 || timeParts.some(part => Number.isNaN(part) || part < 0) || hours! > 23 || minutes! > 60 || seconds! > 60) {
        throw new Error('Error: invalid AUTOMATIC_ARCHIVING_TIME configured! Please specify time like "00:00" in 24 hours format');
    }

    nodeCron.schedule(`${seconds ?? 0} ${minutes} ${hours} * * *`, () => handleAutomaticArchiving());

    console.log(`Automatic archiving has been setup. Answer sheets will be archived ${config.archiving.automaticArchivingPeriodDays} days after the exam took place.`);
}

async function archiveExam(exam: IExam): Promise<void> {
    const examDirectoryPath: string = createArchiveExamPath(exam);
    await fs.mkdir(examDirectoryPath).catch((err) => {
        throw Error(`failed to create archival directory for exam ${exam._id}: `, {cause: err});
    });

    const examMeta: string = JSON.stringify(getExamMetaData(exam), undefined, 4);

    await fs.writeFile(path.join(examDirectoryPath, META_FILE_NAME), examMeta).catch((err) => {
        throw Error(`failed to write meta file for exam ${exam._id}: `, {cause: err});
    });

    await AnswerSheet.find({exam: exam._id}).lean().populate<IAnswerSheet>('submitter').exec().then(async answerSheets => {
        await Promise.all(answerSheets.map(async (answerSheet) => {
            const answerSheetDirectoryPath: string = createArchiveAnswerSheetPath(examDirectoryPath, answerSheet);

            await fs.mkdir(answerSheetDirectoryPath).catch((err) => {
                throw Error(`failed to create archival directory for answer-sheet ${answerSheet._id}: `, {cause: err});
            });

            await Promise.all(answerSheet.files.map(async (file) => {
                await fs.copyFile(file.sysFilePath, createArchiveFilePath(answerSheetDirectoryPath, file));
            }));
        }));
    });

    console.log(`files of exam ${exam._id} exported; starting to verify export`);

    await AnswerSheet.find({exam: exam._id}).lean().populate<IAnswerSheet>('submitter').exec().then(async answerSheets => {
        await Promise.all(answerSheets.map(async (answerSheet) => {
            const answerSheetDirectoryPath: string = createArchiveAnswerSheetPath(examDirectoryPath, answerSheet);
            await Promise.all(answerSheet.files.map(async (file) => {
                if(!await doFileSizesMatch(file.sysFilePath, createArchiveFilePath(answerSheetDirectoryPath, file))){
                    throw new Error(`file ${file._id} (answer-sheet ${answerSheet._id}) could not be verified!`)
                }
            }));
        }));
    });

    await fs.readFile(path.join(examDirectoryPath, META_FILE_NAME), 'utf8')
        .then((buffer) => {
            if(buffer.trim() !== examMeta) {throw new Error('content of metadata file does not match the expected content')}
        })
        .catch((err) => {
            throw new Error(`metadata file of exam ${exam._id} could not be verified: `, err.message);
        })

    console.log(`export of exam ${exam._id} verified; deleting exam`);

    await deleteExamById(exam._id.toString());

    console.log(`exam ${exam._id} has been archived`);
}

function getExamMetaData(exam: IExam): object{
    return {
        _id: exam._id,
        semester: semesterToShorthand(exam.semester),
        title: exam.title,
        date: exam.date.toISOString(),
        primaryExaminer: userToDisplayName(exam.primaryExaminer as unknown as IUserBase),
        secondaryExaminer: userToDisplayName(exam.secondaryExaminer as unknown as IUserBase),
        reviewStartDate: exam.reviewParameters.startDate.toISOString(),
        reviewEndDate: exam.reviewParameters.endDate.toISOString()
    }
}

function createArchiveExamPath(exam: IExam): string{
    return path.join(config.archiving.archiveStorageLocation, `${semesterToShorthand(exam.semester)}_${toFsSafeString(exam.title)}_${toFsSafeString(userToDisplayName(exam.primaryExaminer as unknown as IUserBase) as string)}_${exam._id}`);
}

function createArchiveAnswerSheetPath(archiveExamDirectoryPath: string, answerSheet: IAnswerSheet): string{
    return path.join(archiveExamDirectoryPath, `${answerSheet.submitter.studentId}_${answerSheet._id}`);
}

function createArchiveFilePath(answerSheetDirectoryPath: string, file: IFile): string {
    return path.join(answerSheetDirectoryPath, `${toFsSafeString(file.originalFileName)}_${file._id}.pdf`);
}

async function doFileSizesMatch(filePathA: string, filePathB: string): Promise<boolean>{
    const fileStatA: Stats = await fs.stat(filePathA);
    const fileStatB: Stats = await fs.stat(filePathB);

    return fileStatA.size === fileStatB.size;
}
