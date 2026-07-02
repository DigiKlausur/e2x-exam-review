import {AnswerSheetIdMatchWarning} from '../enums/AnswerSheetIdMatchWarning';
import {IFileProto} from './IFileProto';

export interface IAnswerSheetProto {
  examId: string;
  studentId?: string;
  files: IFileProto[];
  warnings: AnswerSheetIdMatchWarning[];
}
