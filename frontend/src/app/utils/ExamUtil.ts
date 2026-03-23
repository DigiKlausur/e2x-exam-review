import {IExam} from 'e2x-exam-review-backend';
import {asDate} from './DateUtil';

export function prepareExam(exam: IExam): IExam {
  exam.date = asDate(exam.date) as Date;
  exam.reviewParameters.startDate = asDate(exam.reviewParameters.startDate) ?? null;
  exam.reviewParameters.endDate = asDate(exam.reviewParameters.endDate) ?? null;
  return exam;
}
