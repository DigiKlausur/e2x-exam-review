import {AfterViewInit, Component, EventEmitter, inject, Input, Output, SimpleChanges, ViewChild} from '@angular/core';
import {IAnswerSheet, IFile} from "e2x-exam-review-backend";
import {NgbModal, NgbModalRef, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {RouterLink} from '@angular/router';
import {ManagementService} from '../../../services/management-service/management-service';
import {UserDisplayNamePipe} from '../../../pipes/user-display-name-pipe/user-display-name-pipe';
import {ToastService} from '../../../services/toast-service/toast-service';
import {
  ActivateEvent,
  DataTableColumnCellDirective,
  DataTableColumnDirective,
  DatatableComponent,
  DatatableFooterDirective,
  DataTableFooterTemplateDirective,
  DatatablePagerComponent, DatatableRowDetailDirective, DatatableRowDetailTemplateDirective, NgxDatatableMessages,
  SortPropDir
} from '@siemens/ngx-datatable';
import {dataTableDefaultMessages} from '../../../utils/DataTable';
import {environment} from '../../../../environments/environment';
import {DatePipe} from '@angular/common';
@Component({
  selector: 'app-answer-sheet-list',
  templateUrl: './answer-sheet-list.html',
  styleUrl: './answer-sheet-list.scss',
  imports: [
    NgbTooltip,
    RouterLink,
    UserDisplayNamePipe,
    DataTableFooterTemplateDirective,
    DatatableComponent,
    DatatableFooterDirective,
    DatatablePagerComponent,
    DatatableRowDetailDirective,
    DatatableRowDetailTemplateDirective,
    DataTableColumnDirective,
    DataTableColumnCellDirective,
    DatePipe
  ]
})
export class AnswerSheetList implements AfterViewInit {
  private managementService: ManagementService = inject(ManagementService);
  private modalService: NgbModal = inject(NgbModal);
  private toastService: ToastService = inject(ToastService);
  @Input() answerSheets: IAnswerSheet[] = [];
  @Output() onChange: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('confirmDeleteAnswerSheetModal') confirmDeleteAnswerSheetModal!: NgbModal;
  @ViewChild('confirmDeleteAnswerSheetFileModal') confirmDeleteAnswerSheetFileModal!: NgbModal;
  @ViewChild(DatatableComponent) dataTable!: DatatableComponent<IAnswerSheet>;

  confirmDeleteModalRef?: NgbModalRef;

  selectedAnswerSheet?: IAnswerSheet;
  selectedFile?: IFile;

  ngAfterViewInit(): void {
    this.expandAllRows();
  }

  ngOnChanges(changes: SimpleChanges<AnswerSheetList>) {
    if(changes.answerSheets) {
      this.expandAllRows();
    }
  }

  expandAllRows(): void {
    setTimeout(() => {this.dataTable?.rowDetail?.expandAllRows();}, 500);
  }

  protected readonly messages: NgxDatatableMessages = {
    ...dataTableDefaultMessages,
    ...{
      emptyMessage: $localize`:@@app.table.body.no-answer-sheets-notice:No graded exams available`
    }
  };

  handleDeleteAnswerSheet(answerSheet: IAnswerSheet) {
    this.selectedAnswerSheet = answerSheet;

    this.confirmDeleteModalRef = this.modalService.open(this.confirmDeleteAnswerSheetModal, {size: 'md'});
    this.confirmDeleteModalRef.result
      .finally(() => this.selectedAnswerSheet = undefined);
  }

  confirmDeleteAnswerSheet() {
    if(!this.selectedAnswerSheet) return;
    this.managementService.deleteAnswerSheet(this.selectedAnswerSheet._id!).subscribe(() => {
      this.onChange.emit();
      this.confirmDeleteModalRef?.close();
      this.toastService.show({header: $localize`:@@app.toast.header.delete-answer-sheet:Delete Graded Exam`, body: $localize`:@@app.toast.body.delete-answer-sheet:Graded exam sheet deleted successfully`});
    });
  }

  handleDeleteAnswerSheetFile(answerSheet: IAnswerSheet, file: IFile) {
    this.selectedAnswerSheet = answerSheet;
    this.selectedFile = file;

    this.confirmDeleteModalRef = this.modalService.open(this.confirmDeleteAnswerSheetFileModal, {size: 'md'});
    this.confirmDeleteModalRef.result
      .finally(() => {
        this.selectedAnswerSheet = undefined;
        this.selectedFile = undefined;
      });
  }

  confirmDeleteAnswerSheetFile() {
    if(!this.selectedAnswerSheet || !this.selectedFile) return;
    this.managementService.deleteAnswerSheetFile(this.selectedAnswerSheet._id!, this.selectedFile._id!).subscribe(() => {
      this.onChange.emit();
      this.confirmDeleteModalRef?.close();
      this.toastService.show({header: $localize`:@@app.toast.header.delete-answer-sheet-file:Delete Graded Exam File`, body: $localize`:@@app.toast.body.delete-answer-sheet-file:File deleted successfully`});
    });
  }

  async handleActivate(event: ActivateEvent<IAnswerSheet>): Promise<void> {
    if(event.type !== 'click') return;
    if(event.row.files.length > 1) {
      this.dataTable.rowDetail?.toggleExpandRow(event.row);
    }
  }

  getDetailsRowHeight(row: IAnswerSheet | undefined): number{
    return (row?.files.length ?? 0) > 1 ? (row?.files.length ?? 0) * 45 : 0;
  }

  get numberOfFiles(): number {
    return this.answerSheets.reduce((acc: number, curr: IAnswerSheet) => acc + curr.files.length, 0);
  }

  sorts: SortPropDir[] = [
    {
      prop: 'submitter.studentId',
      dir: 'asc'
    }
  ];

  protected readonly Math = Math;
  protected readonly environment = environment;
}
