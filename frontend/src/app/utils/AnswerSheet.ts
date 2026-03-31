import {IAnswerSheet} from 'e2x-exam-review-backend';

export function isReviewAvailable(answerSheet: IAnswerSheet): boolean {
  return !!answerSheet.files[0].filePath
    && (answerSheet.exam.reviewParameters.startDate === null || (answerSheet.exam.reviewParameters.startDate?.getTime() ?? 0) < Date.now())
    && (answerSheet.exam.reviewParameters.endDate === null || (answerSheet.exam.reviewParameters.endDate?.getTime() ?? Number.MAX_VALUE) > Date.now())
}
