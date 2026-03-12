import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import { IAnswerSheet } from "e2xgrader-review-backend";
import {ReviewService} from '../../../services/review-service/review-service';
import {AnswerSheetList} from '../../misc/answer-sheet-list/answer-sheet-list';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
  imports: [
    AnswerSheetList
  ]
})
export class LandingPage implements OnInit {
  private reviewService: ReviewService = inject(ReviewService);
  private changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);

  protected availableAnswerSheets: IAnswerSheet[] = [];

  ngOnInit(): void {
    this.reviewService.listAnswerSheets().subscribe((response) => {
      if(response.body){
        this.availableAnswerSheets = response.body;
        this.changeDetectorRef.detectChanges();
      }
    })
  }
}
