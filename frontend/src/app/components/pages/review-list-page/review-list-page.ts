import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {ExamList} from "../../misc/exam-list/exam-list";
import {ReviewService} from '../../../services/review-service/review-service';
import {IAnswerSheet, IExam} from 'e2x-exam-review-backend';
import {isReviewAvailable} from '../../../utils/AnswerSheet';
import { ReviewList } from '../../misc/review-list/review-list';

@Component({
  selector: 'app-review-list-page',
  imports: [ExamList, ReviewList],
  templateUrl: './review-list-page.html',
  styleUrl: './review-list-page.scss',
})
export class ReviewListPage implements OnInit {
  private reviewService: ReviewService = inject(ReviewService);
  private changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);

  protected availableAnswerSheets: IAnswerSheet[] = [];
  protected exams: { link: string[]; exam: IExam; isAvailable: boolean | (() => boolean) }[] = [];

  ngOnInit(): void {
    this.reviewService.listAnswerSheets().subscribe((response) => {
      this.availableAnswerSheets = response;
      this.changeDetectorRef.detectChanges();
    });
  }
}
