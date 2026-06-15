import { Schema } from "mongoose";
import { IFile } from "../interfaces/IFile";

export const FileSchema: Schema<IFile> = new Schema<IFile>({
  originalFileName: {type: String, required: true},
  sysFilePath: {type: String, required: true, unique: true},
  filePath: {type: String, required: true, unique: true}
});
