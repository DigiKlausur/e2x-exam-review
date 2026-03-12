import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {ExamEditor} from '../../misc/exam-editor/exam-editor';
import {IExam, IExamReviewParameters} from 'e2xgrader-review-backend';
import {ActivatedRoute} from '@angular/router';
import {ManagementService} from '../../../services/management-service/management-service';
import {NgbAlert} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-exam-editor-page',
  imports: [
    ExamEditor,
    NgbAlert
  ],
  templateUrl: './exam-editor-page.html',
  styleUrl: './exam-editor-page.scss',
})
export class ExamEditorPage implements OnInit {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private managementService: ManagementService = inject(ManagementService);
  private changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);

  newExam: boolean = true;

  protected exam?: IExam | {semester: undefined, title: '', date: undefined, primaryExaminer: undefined, secondaryExaminer: undefined, reviewParameters: IExamReviewParameters};

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if(params['id'] === 'new') {
        this.exam = {semester: undefined, title: '', date: undefined, primaryExaminer: undefined, secondaryExaminer: undefined, reviewParameters: {showTextLayer: true, showDownloadButton: true, startDate: null, endDate: null}};
      }else {
        this.managementService.getExamById(params['id']).subscribe(response=> {
          if(response.status === 200 && response.body) {
            this.exam = response.body;
            this.newExam = false;
            this.changeDetectorRef.detectChanges();
          }
        })
      }
    });
  }
}
