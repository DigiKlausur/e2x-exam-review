import {Component, Input} from '@angular/core';
import {IExam} from 'e2xgrader-review-backend';
import {DatePipe} from '@angular/common';
import {SemesterDisplayNamePipe} from '../../../pipes/semester-display-name-pipe/semester-display-name-pipe';
import {UserDisplayNamePipe} from '../../../pipes/user-display-name-pipe/user-display-name-pipe';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-exam-list',
  imports: [
    DatePipe,
    SemesterDisplayNamePipe,
    UserDisplayNamePipe,
    RouterLink
  ],
  templateUrl: './exam-list.html',
  styleUrl: './exam-list.scss',
})
export class ExamList {
  @Input() exams: IExam[] = [];
}
