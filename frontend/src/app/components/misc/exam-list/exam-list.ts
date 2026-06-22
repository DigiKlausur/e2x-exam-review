import {Component, Input, inject, LOCALE_ID} from '@angular/core';
import {IExam} from 'e2x-exam-review-backend';
import {DatePipe} from '@angular/common';
import {SemesterDisplayNamePipe} from '../../../pipes/semester-display-name-pipe/semester-display-name-pipe';
import {UserDisplayNamePipe} from '../../../pipes/user-display-name-pipe/user-display-name-pipe';
import {ActivatedRoute, Router} from '@angular/router';
import {
  ActivateEvent,
  DatatableComponent, DatatableFooterDirective, DataTableFooterTemplateDirective, DatatablePagerComponent,
  NgxDatatableMessages,
  TableColumn
} from '@siemens/ngx-datatable';
import {dataTableDefaultMessages} from '../../../utils/DataTable';

interface Row {link: string[], exam: IExam, isAvailable?: boolean | (() => boolean)}

@Component({
  selector: 'app-exam-list',
  imports: [
    DatatableComponent,
    DatatableFooterDirective,
    DataTableFooterTemplateDirective,
    DatatablePagerComponent
  ],
  templateUrl: './exam-list.html',
  styleUrl: './exam-list.scss',
})
export class ExamList {
  private currentLocale: string =  inject(LOCALE_ID);
  private router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  @Input() exams: Row[] = [];

  private userDisplayNamePipe: UserDisplayNamePipe = new UserDisplayNamePipe();

  columns: TableColumn[] = [
    {prop: 'exam.semester', name: $localize`:@@app.table.header.semster:Semester`, pipe: new SemesterDisplayNamePipe(), flexGrow: 2},
    {prop: 'exam.title', name:  $localize`:@@app.table.header.exam-title:Exam Title`, flexGrow: 4},
    {prop: 'exam.primaryExaminer', name: $localize`:@@app.table.header.primary-examiner:Primary Examiner`, pipe: this.userDisplayNamePipe, flexGrow: 2},
    {prop: 'exam.secondaryExaminer', name: $localize`:@@app.table.header.secondary-examiner:Secondary Examiner`, pipe: this.userDisplayNamePipe, flexGrow: 2},
    {prop: 'exam.date', name: $localize`:@@app.table.header.date:Date`, pipe: new DatePipe(this.currentLocale), flexGrow: 1}
  ];

  protected readonly messages: NgxDatatableMessages = {
    ...dataTableDefaultMessages,
    ...{
      emptyMessage: $localize`:@@app.table.body.no-exams-notice:No exams available`
    }
  };

  handleActivate(event: ActivateEvent<Row>): void {
    if(event.type !== 'click') return;
    this.router.navigate(event.row.link, {relativeTo: this.activatedRoute});
  }

  protected readonly Math = Math;
}
