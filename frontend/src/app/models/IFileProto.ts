import {AnswerSheetFileUploadWarning} from '../enums/AnswerSheetFileUploadWarning';

export interface IFileProto {
  name: string;
  pathName: string;
  getFile: () => Promise<File>;
  warnings:  AnswerSheetFileUploadWarning[]
}
