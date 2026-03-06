import { Component } from '@angular/core';
import {NgxExtendedPdfViewerModule} from "ngx-extended-pdf-viewer";

@Component({
  selector: 'app-answer-sheet-viewer',
    imports: [
        NgxExtendedPdfViewerModule
    ],
  templateUrl: './answer-sheet-viewer.html',
  styleUrl: './answer-sheet-viewer.scss',
})
export class AnswerSheetViewer {}
