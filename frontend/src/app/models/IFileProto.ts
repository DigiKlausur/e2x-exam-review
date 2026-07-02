import {AnswerSheetFileUploadWarning} from '../enums/AnswerSheetFileUploadWarning';

export interface IFileProto {
  file: File;
  warnings:  AnswerSheetFileUploadWarning[]
}
