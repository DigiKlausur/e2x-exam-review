import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {NgxExtendedPdfViewerModule} from 'ngx-extended-pdf-viewer';
import {AnswerSheetViewer} from '../../misc/answer-sheet-viewer/answer-sheet-viewer';
import {ActivatedRoute} from '@angular/router';
import {ReviewService} from '../../../services/review-service/review-service';
import {HttpResponse} from '@angular/common/http';
import {IAnswerSheet} from 'e2xgrader-exam-review-backend';

@Component({
  selector: 'app-review-page',
  imports: [
    NgxExtendedPdfViewerModule,
    AnswerSheetViewer
  ],
  templateUrl: './review-page.html',
  styleUrl: './review-page.scss',
})
export class ReviewPage implements OnInit {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private reviewService: ReviewService = inject(ReviewService);
  private changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);

  answerSheet?: IAnswerSheet;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if(params['id']) {
        this.reviewService.getAnswerSheet(params['id']).subscribe((response: IAnswerSheet) => {
          this.answerSheet = response;
          this.changeDetectorRef.detectChanges();
        });
      }
    })
  }
}
