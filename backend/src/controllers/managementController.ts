import {Request, Response} from "express";
import {User} from "../models/User";
import {Exam} from "../models/Exam";
import {writeFile, mkdir, rm} from "node:fs/promises";
import {ObjectId} from "mongodb";
import {AnswerSheet} from "../models/AnswerSheet";
import {Student} from "../models/Student";
import {IAnswerSheet} from "../interfaces";
import {Document} from 'mongoose';

export async function getExamsByExaminer(req: Request, res: Response) {
    const userId = (await User.findOne().lean())!._id;
    res.send(await Exam.find({$or: [{primaryExaminer: {_id: userId}}, {secondaryExaminer: {_id: userId}}]}).lean().populate(['primaryExaminer', 'secondaryExaminer']));
}

export async function getExamById(req: Request, res: Response) {
    res.send(await Exam.findById(req.params.id).lean().populate(['primaryExaminer', 'secondaryExaminer']));
}

export async function createExam(req: Request, res: Response) {
    req.body.owner = await User.findOne().lean();
    res.send(await Exam.insertOne(req.body));
}

export async function updateExam(req: Request, res: Response) {
    res.send(await Exam.updateOne({_id: req.body._id}, {$set: req.body}));
}

export async function getAnswerSheetsByExamId(req: Request, res: Response) {
    // @ts-ignore
    return res.send(await AnswerSheet.find({"exam": new ObjectId(req.params.id as string)}).populate('submitter').lean());
}

export async function addAnswerSheet(req: Request, res: Response) {
    const exam = await Exam.findById(req.params.id);
    if(!exam) {
        return res.status(400).send({error: 'Exam not found'});
    }
    if (!req.file){
        return res.status(400).send({error: 'File not found'});
    }

    let submitter = await Student.findOne({studentId: req.body.studentId});
    if(!submitter) {
        submitter = new Student({
            studentId: req.body.studentId,
        });
    }

    const fileId = new ObjectId();
    const directoryPath: string =`answer-sheets/${exam._id}`;
    await mkdir(directoryPath, { recursive: true });
    const filePath: string = `${directoryPath}/${fileId}.pdf`;
    await submitter.save();
    await new AnswerSheet({
            exam: exam,
            submitter: submitter,
            filePath: filePath,
            originalFileName: req.body.originalFileName
        })
        .save()
        .then(async (answerSheet: IAnswerSheet) => {
            await writeFile(filePath, req.file!.buffer, {})
            res.send(answerSheet);
        })
        .catch((err) => {
            if (err.code === 11000){
                res.status(400).send({error: 'duplicate answer sheet'});
            }else{
                res.status(500).send({error: err.message});
            }
        })
}

export async function deleteAnswerSheet(req: Request, res: Response) {
    await AnswerSheet.findById(req.params.id)
        .then(async answerSheet => {
            if(!answerSheet) {throw Error('answer sheet not found');}
            await answerSheet.deleteOne()
            await rm(answerSheet.filePath);
            res.send();
        });
}

export async function searchUsers(req: Request, res: Response) {
    const queryRegexs: RegExp[] = (req.query.query as string)
        .trim() // remove leading and trailing whitespace
        .split(' ') //split at spaces
        .filter(part => part) //remove empty parts
        .map(str => new RegExp(str, 'i'));
    res.send(await User.find({$or: [
            {firstname: {$in: queryRegexs}},
            {lastname: {$in: queryRegexs}},
            {email: {$in: queryRegexs}}
        ]}));
}
