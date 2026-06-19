import {ObjectId} from "mongoose";

export interface IUserBase {
    _id?: ObjectId;
    uniqueId: string;
    email: string;
    firstname: string;
    lastname: string;
}

export type IUser = Omit<IUserBase, '_id'> & {_id: string};
