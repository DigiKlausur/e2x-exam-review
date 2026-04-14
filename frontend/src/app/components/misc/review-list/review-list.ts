import { Component, Input } from '@angular/core';
import {DatePipe} from "@angular/common";
import {SemesterDisplayNamePipe} from "../../../pipes/semester-display-name-pipe/semester-display-name-pipe";
import {UserDisplayNamePipe} from "../../../pipes/user-display-name-pipe/user-display-name-pipe";
import { IAnswerSheet, IExam } from 'e2x-exam-review-backend';
import { isReviewAvailable } from '../../../utils/AnswerSheet';
import { RouterLink } from '@angular/router';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-review-list',
  imports: [DatePipe, SemesterDisplayNamePipe, UserDisplayNamePipe, RouterLink, NgbTooltip],
  templateUrl: './review-list.html',
  styleUrl: './review-list.scss',
})
export class ReviewList {
  @Input() answerSheets: IAnswerSheet[] = [];

  protected isAvailable(answerSheet: IAnswerSheet): boolean {
    return isReviewAvailable(answerSheet);
  }

  protected isSingleFile(answerSheet: IAnswerSheet): boolean {
    return answerSheet.files.length === 1;
  }
}
