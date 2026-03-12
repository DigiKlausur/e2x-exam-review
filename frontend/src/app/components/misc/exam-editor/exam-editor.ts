import { Component } from '@angular/core';
import {DateInput} from "../../inputs/date-input/date-input";
import {UserSearchInput} from "../../inputs/user-search-input/user-search-input";
import {NgbCollapse} from '@ng-bootstrap/ng-bootstrap';
import {buffer} from 'rxjs';
import {SemesterInput} from '../../inputs/semester-input/semester-input';

@Component({
  selector: 'app-exam-editor',
  imports: [
    DateInput,
    UserSearchInput,
    NgbCollapse,
    SemesterInput
  ],
  templateUrl: './exam-editor.html',
  styleUrl: './exam-editor.scss',
})
export class ExamEditor {
  protected collapseReviewSettings: boolean = true;
  protected readonly buffer = buffer;
}
