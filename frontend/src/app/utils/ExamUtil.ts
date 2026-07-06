import {IExam} from 'e2x-exam-review-backend';
import {asDate} from './DateUtil';

export function prepareExam(exam: IExam): IExam {
  exam.date = asDate(exam.date) as Date;
  exam.reviewParameters.startDate = asDate(exam.reviewParameters.startDate) as Date;
  exam.reviewParameters.endDate = asDate(exam.reviewParameters.endDate) as Date;
  return exam;
}
