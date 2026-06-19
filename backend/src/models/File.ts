import { Schema } from "mongoose";
import { IFileBase } from "../interfaces/IFile";

export const FileSchema: Schema<IFileBase> = new Schema<IFileBase>({
  originalFileName: {type: String, required: true},
  sysFilePath: {type: String, required: true, unique: true},
  filePath: {type: String, required: true, unique: true}
});
