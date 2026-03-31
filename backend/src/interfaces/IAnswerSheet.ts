import {IExam} from "./IExam";
import {IStudent} from "./IStudent";
import { IFile } from "./IFile";

export interface IAnswerSheet {
    _id?: string;
    exam: IExam;
    submitter: IStudent;
    files: IFile[];
}
