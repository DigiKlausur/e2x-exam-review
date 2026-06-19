import {ObjectId} from "mongoose";

export interface IStudentBase {
    _id?: ObjectId;
    studentId: number;
    uniqueId?: string;
    email?: string;
    firstname?: string;
    lastname?: string;
}

export type IStudent = Omit<IStudentBase, '_id'> & {_id: string};
