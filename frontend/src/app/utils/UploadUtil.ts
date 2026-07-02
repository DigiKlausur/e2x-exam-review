import {AnswerSheetFileUploadWarning} from '../enums/AnswerSheetFileUploadWarning';
import {AnswerSheetIdMatchWarning} from '../enums/AnswerSheetIdMatchWarning';

export function hasWarning<T extends AnswerSheetFileUploadWarning|AnswerSheetIdMatchWarning>(warnings: T[], warning: T): boolean{
  return warnings.includes(warning);
}
