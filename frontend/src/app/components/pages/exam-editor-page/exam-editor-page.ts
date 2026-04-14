import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {ExamEditor} from '../../misc/exam-editor/exam-editor';
import {IAnswerSheet, IExam, IExamReviewParameters} from 'e2x-exam-review-backend';
import {ActivatedRoute} from '@angular/router';
import {ManagementService} from '../../../services/management-service/management-service';
import {NgbAlert, NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import {AnswerSheetList} from '../../misc/answer-sheet-list/answer-sheet-list';
import {AnswerSheetUploader} from '../../misc/answer-sheet-uploader/answer-sheet-uploader';

@Component({
  selector: 'app-exam-editor-page',
  imports: [
    ExamEditor,
    NgbAlert,
    AnswerSheetList,
    AnswerSheetUploader,
    NgbPopover
  ],
  templateUrl: './exam-editor-page.html',
  styleUrl: './exam-editor-page.scss',
})
export class ExamEditorPage implements OnInit {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  private managementService: ManagementService = inject(ManagementService);

  protected examId!: string;
  protected answerSheets: IAnswerSheet[] = [];

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.examId = params['id'];
      this.changeDetectorRef.detectChanges();
      if(this.examId !== 'new') this.loadAnswerSheets();
    });
  }

  loadAnswerSheets(): void {
    this.managementService.listAnswerSheets(this.examId).subscribe(answerSheets => {
      this.answerSheets = answerSheets;
      this.changeDetectorRef.detectChanges();
    });
  }
}
