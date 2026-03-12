import {Component, Input, SimpleChanges} from '@angular/core';
import { IAnswerSheet, IUser } from "e2xgrader-review-backend";
import {SemesterDisplayNamePipe} from '../../../pipes/semester-display-name-pipe/semester-display-name-pipe';
import {UserDisplayNamePipe} from '../../../pipes/user-display-name-pipe/user-display-name-pipe';
import {DatePipe} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-answer-sheet-list',
  imports: [
    SemesterDisplayNamePipe,
    UserDisplayNamePipe,
    DatePipe,
    RouterLink
  ],
  templateUrl: './answer-sheet-list.html',
  styleUrl: './answer-sheet-list.scss',
})
export class AnswerSheetList {
  @Input() answerSheets: IAnswerSheet[] = [];

  isUnavailable(answerSheet: IAnswerSheet): boolean {
    return !answerSheet.filePath
      || (answerSheet.exam.reviewParameters.startDate !== null && (answerSheet.exam.reviewParameters.startDate?.getTime() ?? 0) > Date.now())
      || (answerSheet.exam.reviewParameters.endDate !== null && (answerSheet.exam.reviewParameters.endDate?.getTime() ?? Number.MAX_VALUE) > Date.now())
  }
}
