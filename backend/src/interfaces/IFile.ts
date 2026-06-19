import {ObjectId} from "mongoose";

export interface IFileBase {
  _id?: ObjectId;
  originalFileName: string;
  sysFilePath: string;
  filePath: string;
}

export type IFile = Omit<IFileBase, '_id'> & {_id: string};
