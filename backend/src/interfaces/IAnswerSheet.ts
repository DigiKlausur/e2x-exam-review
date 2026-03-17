import {IExam} from "./IExam";
import {IStudent} from "./IStudent";

export interface IAnswerSheet {
    _id?: string;
    exam: IExam;
    submitter: IStudent;
    filePath: string;
    originalFileName: string;
}
