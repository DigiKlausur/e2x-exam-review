import { Component } from '@angular/core';
import {NgxExtendedPdfViewerModule} from 'ngx-extended-pdf-viewer';
import {AnswerSheetViewer} from '../../misc/answer-sheet-viewer/answer-sheet-viewer';

@Component({
  selector: 'app-review-page',
  imports: [
    NgxExtendedPdfViewerModule,
    AnswerSheetViewer
  ],
  templateUrl: './review-page.html',
  styleUrl: './review-page.scss',
})
export class ReviewPage {}
