import {ISemester} from "./ISemester";
import {IUser} from "./IUser";
import {IExamReviewParameters} from "./IExamReviewParameters";

export interface IExam {
    _id?: string;
    title: string;
    semester: ISemester;
    primaryExaminer: IUser;
    secondaryExaminer?: IUser;
    date: Date;
    reviewParameters: IExamReviewParameters;
    owner: IUser;
}
