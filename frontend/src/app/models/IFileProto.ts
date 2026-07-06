import {AnswerSheetFileUploadWarning} from '../enums/AnswerSheetFileUploadWarning';

export interface IFileProto {
  name: string;
  getFile: () => Promise<File>;
  warnings:  AnswerSheetFileUploadWarning[]
}
