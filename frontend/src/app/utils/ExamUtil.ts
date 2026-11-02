import {IExam} from 'e2x-exam-review-backend';
import {asDate} from './DateUtil';
import {ExamReviewStatus} from '../enums/ExamReviewStatus';

export function prepareExam(exam: IExam): IExam {
  exam.date = asDate(exam.date) as Date;
  exam.reviewParameters.startDate = asDate(exam.reviewParameters.startDate) as Date;
  exam.reviewParameters.endDate = asDate(exam.reviewParameters.endDate) as Date;
  return exam;
}

export function getExamReviewStatus(exam: IExam) {
  console.log(exam);
  const now = new Date();
  return now < exam.reviewParameters.startDate ? ExamReviewStatus.UPCOMING : (now > exam.reviewParameters.endDate ? ExamReviewStatus.CONCLUDED : ExamReviewStatus.IN_PROGRESS );
}
