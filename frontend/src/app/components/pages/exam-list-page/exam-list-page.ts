import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {ExamList} from '../../misc/exam-list/exam-list';
import {RouterLink} from '@angular/router';
import {IExam} from 'e2xgrader-exam-review-backend';
import {ManagementService} from '../../../services/management-service/management-service';

@Component({
  selector: 'app-exam-list-page',
  imports: [
    ExamList,
    RouterLink
  ],
  templateUrl: './exam-list-page.html',
  styleUrl: './exam-list-page.scss',
})
export class ExamListPage implements OnInit {
  private managementService = inject(ManagementService);
  private changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);

  protected exams: {link: string[], exam: IExam}[] = [];

  ngOnInit(): void {
    this.managementService.listExams().subscribe(response => {
      this.exams = response.map((exam: IExam) => ({link: ['exam', exam._id!], exam: exam}));
      this.changeDetectorRef.detectChanges();
    })
  }
}
