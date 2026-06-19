import {IFile, IFileBase} from "./IFile";
import {ObjectId} from "mongodb";
import {IStudent, IStudentBase} from "./IStudent";
import {IExam, IExamPopulated} from "./IExam";

export interface IAnswerSheetBase {
    exam: ObjectId;
    submitter: ObjectId;
    files: IFileBase[];
}

export type IAnswerSheetPopulated = Omit<IAnswerSheetBase, '_id' | 'exam' | 'submitter'> & {_id: ObjectId; exam: IExamPopulated; submitter: IStudentBase};

export type IAnswerSheet = Omit<IAnswerSheetBase, '_id' | 'exam' | 'files' |'submitter'> & {_id: string; exam: IExam; files: IFile[]; submitter: IStudent};
