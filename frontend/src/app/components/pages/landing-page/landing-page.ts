import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {IAnswerSheet, IExam} from "e2xgrader-exam-review-backend";
import {ReviewService} from '../../../services/review-service/review-service';
import {AnswerSheetList} from '../../misc/answer-sheet-list/answer-sheet-list';
import {ExamList} from '../../misc/exam-list/exam-list';
import {isReviewAvailable} from '../../../utils/AnswerSheet';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
  imports: [
    AnswerSheetList,
    ExamList
  ]
})
export class LandingPage implements OnInit {
  private reviewService: ReviewService = inject(ReviewService);
  private changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);

  protected availableAnswerSheets: IAnswerSheet[] = [];
  protected exams: {link: string[], exam: IExam, isAvailable: boolean | (() => boolean)}[] = [];

  ngOnInit(): void {
    this.reviewService.listAnswerSheets().subscribe((response) => {
      this.availableAnswerSheets = response;
      this.exams = this.availableAnswerSheets.map((sheet: IAnswerSheet) => ({
        link: ['review', sheet._id as string],
        exam: sheet.exam,
        isAvailable:  isReviewAvailable(sheet)
      }));
      this.changeDetectorRef.detectChanges();
    })
  }
}
