export enum ExamReviewStatus {
  UPCOMING = 'upcoming',
  IN_PROGRESS = 'in_progress',
  CONCLUDED = 'concluded'
}

export const examReviewStatusNames: Record<ExamReviewStatus, string> = {
  [ExamReviewStatus.UPCOMING]: $localize`:@@app.exam-review-status.upcoming:upcoming`,
  [ExamReviewStatus.IN_PROGRESS]: $localize`:@@app.exam-review-status.in_progress:in progress`,
  [ExamReviewStatus.CONCLUDED]: $localize`:@@app.exam-review-status.concluded:concluded`
}
