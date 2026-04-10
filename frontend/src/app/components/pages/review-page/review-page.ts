import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {NgxExtendedPdfViewerModule} from 'ngx-extended-pdf-viewer';
import {AnswerSheetViewer} from '../../misc/answer-sheet-viewer/answer-sheet-viewer';
import {ActivatedRoute} from '@angular/router';
import {ReviewService} from '../../../services/review-service/review-service';
import {IAnswerSheet, IFile} from 'e2x-exam-review-backend';
import {NgbAlert} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-review-page',
  imports: [
    NgxExtendedPdfViewerModule,
    AnswerSheetViewer,
    NgbAlert
  ],
  templateUrl: './review-page.html',
  styleUrl: './review-page.scss',
})
export class ReviewPage implements OnInit {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private reviewService: ReviewService = inject(ReviewService);
  private changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);

  answerSheet?: IAnswerSheet;
  file?: IFile;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if(params['assignmentId'] && params['fileId']) {
        this.reviewService.getAnswerSheet(params['assignmentId']).subscribe((response: IAnswerSheet) => {
          this.answerSheet = response;
          this.file = this.answerSheet.files.find((file: IFile) => file._id === params['fileId']);
          this.changeDetectorRef.detectChanges();
        });
      }
    })
  }
}
