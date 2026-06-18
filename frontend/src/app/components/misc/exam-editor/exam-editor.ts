import {Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {DateInput} from "../../inputs/date-input/date-input";
import {UserSearchInput} from "../../inputs/user-search-input/user-search-input";
import {NgbCollapse, NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import {SemesterInput} from '../../inputs/semester-input/semester-input';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {IExam, ISemester, IUser} from 'e2x-exam-review-backend';
import {ManagementService} from '../../../services/management-service/management-service';
import {Router} from '@angular/router';
import { ToastService } from '../../../services/toast-service/toast-service';
import { HttpErrorResponse } from '@angular/common/http';
import { ShowInvalid } from '../../../directives/show-invalid/show-invalid';
import {DateTimeInput} from '../../inputs/date-time-input/date-time-input.component';
import {dateSequenceValidator, minDateValidator} from '../../../utils/DateUtil';

@Component({
  selector: 'app-exam-editor',
  imports: [
    DateInput,
    UserSearchInput,
    NgbCollapse,
    SemesterInput,
    ReactiveFormsModule,
    ShowInvalid,
    NgbPopover,
    DateTimeInput,
  ],
  templateUrl: './exam-editor.html',
  styleUrl: './exam-editor.scss',
})
export class ExamEditor implements OnChanges {
  private managementService: ManagementService = inject(ManagementService);
  private toastService: ToastService = inject(ToastService);
  private router: Router = inject(Router);
  protected collapseReviewSettings: boolean = true;

  private isNewExam: boolean = false;
  @Input() examId!: string;
  protected exam?: IExam;

  private readonly now: Date = new Date();

  protected examForm: FormGroup = new FormGroup({
    title: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(512)
    ]),
    semester: new FormControl<ISemester | undefined>(undefined, [Validators.required]),
    primaryExaminer: new FormControl<IUser | undefined>(undefined, [Validators.required]),
    secondaryExaminer: new FormControl<IUser | undefined>(undefined),
    date: new FormControl<Date | undefined>(undefined, [Validators.required]),
    reviewParameters: new FormGroup({
      startDate: new FormControl<Date | null>(null),
      endDate: new FormControl<Date | null>(null),
      showDownloadButton: new FormControl<boolean>(false),
      showTextLayer: new FormControl<boolean>(false),
    },
    {validators: dateSequenceValidator('startDate', 'endDate'),}),
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['examId']) {
      if (this.examId !== 'new') {
        this.managementService.getExamById(this.examId).subscribe((response) => {
          this.exam = response;
          this.isNewExam = false;
          this.loadValues();
        });
      } else {
        this.examForm.reset();
        this.isNewExam = true;
      }
    }
  }

  loadValues(): void {
    if (this.exam) {
      this.examForm.patchValue(this.exam);
    }
  }

  getFormValues(): IExam {
    const formValues: IExam = this.examForm.value;
    formValues._id = this.exam?._id ?? undefined;
    if (formValues.reviewParameters.startDate === null)
      formValues.reviewParameters.startDate = this.exam?.reviewParameters.startDate ?? null;
    if (formValues.reviewParameters.endDate === null)
      formValues.reviewParameters.endDate = this.exam?.reviewParameters.endDate ?? null;
    if (formValues.reviewParameters.showDownloadButton === null)
      formValues.reviewParameters.showDownloadButton =
        this.exam?.reviewParameters.showDownloadButton ?? false;
    if (formValues.reviewParameters.showTextLayer === null)
      formValues.reviewParameters.showTextLayer =
        this.exam?.reviewParameters.showTextLayer ?? false;
    return formValues;
  }

  saveExam(): void {
    this.examForm.markAllAsTouched();
    if(!this.examForm.valid) {
      this.toastService.show({
        header: $localize`:@@app.toast.header.exam-editor:Exam Editor`,
        body: $localize`:@@app.toast.body.exam-save-validation-error:Input invalid! Please fill in the form according to the instructions.`,
        classname: 'bg-warning',
        delay: 10000,
      });
      return;
    }
    if (this.isNewExam) {
      this.managementService.createExam(this.getFormValues()).subscribe({
        next: (response) => {
          this.showSuccessfulResponse();
          this.router.navigate(['/', 'manage', 'exam', response._id]);
        },
        error: (error) => this.showErrorResponse(error),
      });
    } else {
      this.managementService.updateExam(this.getFormValues()).subscribe({
        next: (response) => this.showSuccessfulResponse(),
        error: (error: HttpErrorResponse) => this.showErrorResponse(error),
      });
    }
  }

  private showSuccessfulResponse(): void {
    this.toastService.show({
      header: $localize`:@@app.toast.header.exam-editor:Exam Editor`,
      body: $localize`:@@app.toast.body.exam-saved-successfully:Exam has been saved successfully.`,
      classname: 'bg-warn',
    });
  }

  private showErrorResponse(error: HttpErrorResponse): void {
    console.warn('Failed to save exam:', error.error ?? error);
    this.toastService.show({
      header: $localize`:@@app.toast.header.exam-editor:Exam Editor`,
      body: $localize`:@@app.toast.body.exam-save-failed:Failed to save exam!`,
      classname: 'bg-danger text-white',
      delay: -1,
    });
  }
}
