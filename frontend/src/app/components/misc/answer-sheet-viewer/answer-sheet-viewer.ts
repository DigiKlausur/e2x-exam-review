import {Component, Input} from '@angular/core';
import {NgxExtendedPdfViewerModule} from "ngx-extended-pdf-viewer";
import {IAnswerSheet} from 'e2xgrader-exam-review-backend';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-answer-sheet-viewer',
    imports: [
        NgxExtendedPdfViewerModule
    ],
  templateUrl: './answer-sheet-viewer.html',
  styleUrl: './answer-sheet-viewer.scss',
})
export class AnswerSheetViewer {
  @Input() answerSheet!: IAnswerSheet;
  protected readonly environment = environment;
}
