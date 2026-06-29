import {Component, inject, Input, LOCALE_ID, ViewChild} from '@angular/core';
import {DatePipe} from "@angular/common";
import {SemesterDisplayNamePipe} from "../../../pipes/semester-display-name-pipe/semester-display-name-pipe";
import {UserDisplayNamePipe} from "../../../pipes/user-display-name-pipe/user-display-name-pipe";
import {IAnswerSheet, IFile} from 'e2x-exam-review-backend';
import {ActivatedRoute, Router} from '@angular/router';
import {
  ActivateEvent,
  DatatableComponent,
  DatatableFooterDirective,
  DataTableFooterTemplateDirective,
  DatatablePagerComponent, DatatableRowDetailDirective,
  DatatableRowDetailTemplateDirective, NgxDatatableMessages, SortPropDir, TableColumn
} from '@siemens/ngx-datatable';
import {datatableDefaultColumnSettings, dataTableDefaultMessages} from '../../../utils/DataTable';
import {environment} from '../../../../environments/environment';
import {ToastService} from '../../../services/toast-service/toast-service';

@Component({
  selector: 'app-review-list',
  imports: [DataTableFooterTemplateDirective, DatatableComponent, DatatableFooterDirective, DatatablePagerComponent, DatatableRowDetailDirective, DatatableRowDetailTemplateDirective],
  templateUrl: './review-list.html',
  styleUrl: './review-list.scss',
})
export class ReviewList {
  private currentLocale: string =  inject(LOCALE_ID);
  private router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private toastService: ToastService = inject(ToastService);

  @Input() answerSheets: IAnswerSheet[] = [];

  @ViewChild(DatatableComponent) dataTable!: DatatableComponent<IAnswerSheet>;

  protected isSingleFile(answerSheet: IAnswerSheet): boolean {
    return answerSheet.files.length === 1;
  }

  protected readonly messages: NgxDatatableMessages = {
    ...dataTableDefaultMessages,
    ...{
      emptyMessage: $localize`:@@app.table.body.no-exams-notice:No exams available`
    }
  };

  private userDisplayNamePipe: UserDisplayNamePipe = new UserDisplayNamePipe();

  async handleActivate(event: ActivateEvent<IAnswerSheet>): Promise<void> {
    if(event.type !== 'click') return;
    if(!event.row.files || event.row.files.length === 0) {
      this.toastService.show({header: $localize`:@@app.toast.header.exam-review-ended:Exam Review Expired`, body: $localize`:@@app.toast.body.exam-review-ended:This exam's review-period has already ended. You are not able to access it anymore.`});
      return;
    }
    if(this.isSingleFile(event.row)) await this.showAnswerSheetFile(event.row._id, event.row.files[0]);
    else {
      this.dataTable.rowDetail?.toggleExpandRow(event.row);
    }
  }

  async showAnswerSheetFile(answerSheetId: string, file: IFile): Promise<void> {
    await this.router.navigate([answerSheetId, file._id], {relativeTo: this.activatedRoute});
  }

  getDetailsRowHeight(row: IAnswerSheet | undefined): number{
    return (row?.files.length ?? 0) * 45;
  }

  cellClass({row}: {row: IAnswerSheet}){
    return row.files?.length < 1 ? 'disabled' : '';
  }

  columns: TableColumn[] = [
    {prop: 'exam.semester', name: $localize`:@@app.table.header.semster:Semester`, pipe: new SemesterDisplayNamePipe(), flexGrow: 2, ...datatableDefaultColumnSettings, cellClass: this.cellClass},
    {prop: 'exam.title', name:  $localize`:@@app.table.header.exam-title:Exam Title`, flexGrow: 4, ...datatableDefaultColumnSettings, cellClass: this.cellClass},
    {prop: 'exam.primaryExaminer', name: $localize`:@@app.table.header.primary-examiner:Primary Examiner`, pipe: this.userDisplayNamePipe, flexGrow: 2, ...datatableDefaultColumnSettings, cellClass: this.cellClass},
    {prop: 'exam.secondaryExaminer', name: $localize`:@@app.table.header.secondary-examiner:Secondary Examiner`, pipe: this.userDisplayNamePipe, flexGrow: 2, ...datatableDefaultColumnSettings, cellClass: this.cellClass},
    {prop: 'exam.date', name: $localize`:@@app.table.header.date:Date`, pipe: new DatePipe(this.currentLocale), flexGrow: 1, ...datatableDefaultColumnSettings, cellClass: this.cellClass}
  ];

  sorts: SortPropDir[] = [
    {
      prop: 'exam.semester',
      dir: 'desc'
    }
  ];

  protected readonly Math = Math;
  protected readonly environment = environment;
}
