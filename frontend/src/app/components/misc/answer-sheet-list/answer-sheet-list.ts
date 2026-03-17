import {Component, Input} from '@angular/core';
import { IAnswerSheet } from "e2xgrader-exam-review-backend";
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-answer-sheet-list',
  templateUrl: './answer-sheet-list.html',
  styleUrl: './answer-sheet-list.scss',
  imports: [
    NgbTooltip,
    RouterLink
  ]
})
export class AnswerSheetList {
  @Input() answerSheets: IAnswerSheet[] = [];

  handleDeleteAnswerSheet(answerSheet: IAnswerSheet) {

  }
}
