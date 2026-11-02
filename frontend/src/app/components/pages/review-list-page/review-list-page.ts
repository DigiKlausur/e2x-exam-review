import {ChangeDetectorRef, Component, effect, inject} from '@angular/core';
import {ReviewService} from '../../../services/review-service/review-service';
import {IAnswerSheet, IExam} from 'e2x-exam-review-backend';
import { ReviewList } from '../../misc/review-list/review-list';

@Component({
  selector: 'app-review-list-page',
  imports: [ReviewList],
  templateUrl: './review-list-page.html',
  styleUrl: './review-list-page.scss',
})
export class ReviewListPage {
  private reviewService: ReviewService = inject(ReviewService);
  private changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);

  protected availableAnswerSheets: IAnswerSheet[] = [];
  protected exams: { link: string[]; exam: IExam; isAvailable: boolean | (() => boolean) }[] = [];

  constructor() {
    effect(() => {
      if(this.reviewService.studentDataUpdatedSignal()) this.loadAnswerSheets();
    });
  }

  loadAnswerSheets(): void {
    this.reviewService.listAnswerSheets().subscribe((response) => {
      this.availableAnswerSheets = response;
      this.changeDetectorRef.detectChanges();
    });
  }
}
