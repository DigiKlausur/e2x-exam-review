import { Component } from '@angular/core';
import {DateInput} from "../../inputs/date-input/date-input";
import {UserSearchInput} from "../../inputs/user-search-input/user-search-input";
import {NgbCollapse} from '@ng-bootstrap/ng-bootstrap';
import {SemesterInput} from '../../inputs/semester-input/semester-input';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ISemester, IUser} from 'e2xgrader-review-backend';

@Component({
  selector: 'app-exam-editor',
  imports: [
    DateInput,
    UserSearchInput,
    NgbCollapse,
    SemesterInput,
    ReactiveFormsModule
  ],
  templateUrl: './exam-editor.html',
  styleUrl: './exam-editor.scss',
})
export class ExamEditor {
  protected collapseReviewSettings: boolean = true;

  protected examForm: FormGroup = new FormGroup({
    title: new FormControl<string>('', [Validators.required]),
    semester: new FormControl<ISemester|undefined>(undefined, [Validators.required]),
    primaryExaminer: new FormControl<IUser|undefined>(undefined, [Validators.required]),
    secondaryExaminer: new FormControl<IUser|undefined>(undefined, [Validators.required]),
    date: new FormControl<Date|undefined>(undefined, [Validators.required]),
    reviewParameters: new FormGroup({
      startDate: new FormControl<Date|null>(null),
      endDate: new FormControl<Date|null>(null),
      showDownloadButton: new FormControl<boolean>(false),
      showTextLayer: new FormControl<boolean>(false)
    })
  })
}
