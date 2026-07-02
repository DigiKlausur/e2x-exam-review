import {ObjectId} from "mongoose";

export interface IFileBase {
  _id?: ObjectId;
  originalFileName: string;
  sysFilePath: string;
  filePath: string;
  uploadTimeStamp?: Date;
}

export type IFile = Omit<IFileBase, '_id'|'uploadTimeStamp'> & {_id: string; uploadTimeStamp: Date};
