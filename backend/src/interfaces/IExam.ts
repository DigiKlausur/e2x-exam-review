import {ISemester} from "./ISemester";
import {IExamReviewParameters} from "./IExamReviewParameters";
import {ObjectId} from "mongodb";
import {IUser, IUserBase} from "./IUser";

export interface IExamBase {
    title: string;
    semester: ISemester;
    primaryExaminer: ObjectId;
    secondaryExaminer?: ObjectId;
    date: Date;
    reviewParameters: IExamReviewParameters;
    owner: ObjectId;
}

export type IExamPopulated = Omit<IExamBase, '_id' | 'primaryExaminer' | 'secondaryExaminer' | 'owner'> & {_id: ObjectId, primaryExaminer: IUserBase; secondaryExaminer?: IUserBase; owner: IUserBase};

export type IExam = Omit<IExamBase, '_id' | 'primaryExaminer' | 'secondaryExaminer' | 'owner'> & {_id: string, primaryExaminer: IUser; secondaryExaminer?: IUser; owner: IUser};
