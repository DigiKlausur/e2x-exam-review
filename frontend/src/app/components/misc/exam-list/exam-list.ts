import {Component, Input, inject, LOCALE_ID} from '@angular/core';
import {IExam} from 'e2x-exam-review-backend';
import {DatePipe} from '@angular/common';
import {SemesterDisplayNamePipe} from '../../../pipes/semester-display-name-pipe/semester-display-name-pipe';
import {UserDisplayNamePipe} from '../../../pipes/user-display-name-pipe/user-display-name-pipe';
import {ActivatedRoute, Router} from '@angular/router';
import {
  ActivateEvent,
  DatatableComponent, DatatableFooterDirective, DataTableFooterTemplateDirective, DatatablePagerComponent,
  NgxDatatableMessages, SortPropDir,
  TableColumn
} from '@siemens/ngx-datatable';
import {datatableDefaultColumnSettings, dataTableDefaultMessages} from '../../../utils/DataTable';
import {environment} from '../../../../environments/environment';

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
export class ExamList{
  private currentLocale: string =  inject(LOCALE_ID);
  private router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  @Input() exams: Row[] = [];

  private userDisplayNamePipe: UserDisplayNamePipe = new UserDisplayNamePipe();

  columns: TableColumn[] = [
    {prop: 'exam.semester', name: $localize`:@@app.table.header.semster:Semester`, pipe: new SemesterDisplayNamePipe(), flexGrow: 2, ...datatableDefaultColumnSettings},
    {prop: 'exam.title', name:  $localize`:@@app.table.header.exam-title:Exam Title`, flexGrow: 4, ...datatableDefaultColumnSettings},
    {prop: 'exam.primaryExaminer', name: $localize`:@@app.table.header.primary-examiner:Primary Examiner`, pipe: this.userDisplayNamePipe, flexGrow: 2, ...datatableDefaultColumnSettings},
    {prop: 'exam.secondaryExaminer', name: $localize`:@@app.table.header.secondary-examiner:Secondary Examiner`, pipe: this.userDisplayNamePipe, flexGrow: 2, ...datatableDefaultColumnSettings},
    {prop: 'exam.date', name: $localize`:@@app.table.header.date:Date`, pipe: new DatePipe(this.currentLocale), flexGrow: 1, ...datatableDefaultColumnSettings}
  ];

  sorts: SortPropDir[] = [
    {
      prop: 'exam.semester',
      dir: 'desc'
    }
  ];

  protected readonly messages: NgxDatatableMessages = {
    ...dataTableDefaultMessages,
    ...{
      emptyMessage: $localize`:@@app.table.body.no-exams-notice:No exams available`
    }
  };

  async handleActivate(event: ActivateEvent<Row>): Promise<void> {
    if(event.type !== 'click') return;
    await this.router.navigate(event.row.link, {relativeTo: this.activatedRoute});
  }

  protected readonly Math = Math;
  protected readonly environment = environment;
}
