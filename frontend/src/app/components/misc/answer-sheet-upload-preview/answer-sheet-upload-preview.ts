import {AfterViewInit, Component, EventEmitter, Input, Output, SimpleChanges, ViewChild} from '@angular/core';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {IAnswerSheetProto} from '../../../models/IAnswerSheetProto';
import {
  DataTableColumnCellDirective,
  DataTableColumnDirective,
  DatatableComponent, DatatableFooterDirective,
  DataTableFooterTemplateDirective, DatatablePagerComponent, DatatableRowDetailDirective,
  DatatableRowDetailTemplateDirective, SortPropDir
} from '@siemens/ngx-datatable';
import {environment} from '../../../../environments/environment';
import {dataTableDefaultMessages} from '../../../utils/DataTable';
import {IFileProto} from '../../../models/IFileProto';
import {AnswerSheetFileUploadWarning} from '../../../enums/AnswerSheetFileUploadWarning';
import {AnswerSheetIdMatchWarning} from '../../../enums/AnswerSheetIdMatchWarning';
import {hasWarning} from '../../../utils/UploadUtil';
import {DatatableDetailsRow} from '../../../directives/datatable-details-row/datatable-details-row';

const warningSeverities: Record<AnswerSheetFileUploadWarning | AnswerSheetIdMatchWarning, number> = {
  [AnswerSheetIdMatchWarning.NO_MATCH]: 3,
  [AnswerSheetIdMatchWarning.UNAMBIGUOUS_MATCH]: 3,
  [AnswerSheetFileUploadWarning.INVALID_TYPE]: 2,
  [AnswerSheetFileUploadWarning.DUPLICATE]: 1
};

const highestSeverityLevel: number = Math.max(...Object.values(warningSeverities));

@Component({
  selector: 'app-answer-sheet-upload-preview',
  imports: [
    NgbTooltip,
    DatatableComponent,
    DataTableColumnCellDirective,
    DataTableColumnDirective,
    DataTableFooterTemplateDirective,
    DatatableFooterDirective,
    DatatablePagerComponent,
    DatatableRowDetailDirective,
    DatatableRowDetailTemplateDirective,
    DatatableDetailsRow
  ],
  templateUrl: './answer-sheet-upload-preview.html',
  styleUrl: './answer-sheet-upload-preview.scss',
})
export class AnswerSheetUploadPreview implements AfterViewInit {
  @Input() uploadQueue: IAnswerSheetProto[] = [];
  @Output() uploadAnswerSheets: EventEmitter<'dismiss'|'overwrite'> = new EventEmitter<'dismiss'|'overwrite'>();

  @ViewChild(DatatableComponent) dataTable!: DatatableComponent<IAnswerSheetProto>;

  ngAfterViewInit(): void {
    this.expandAllRows();
  }

  ngOnChanges(changes: SimpleChanges<AnswerSheetUploadPreview>) {
    if(changes.uploadQueue) {
      this.expandAllRows();
    }
  }

  expandAllRows(): void {
    setTimeout(() => {
      console.log(this.dataTable);
      this.dataTable?.rowDetail?.expandAllRows();
    }, 1000);
  }

  getDetailsRowHeight(row: IAnswerSheetProto | undefined): number{
    return (row?.files.length ?? 0) * 45;
  }

  get numberOfStudents(): number {
    return this.uploadQueue.reduce((acc: number, curr:IAnswerSheetProto) => acc + (curr.studentId ? 1 : 0), 0);
  }

  get numberOfMatchedFiles(): number {
    return this.uploadQueue.reduce((acc: number, curr:IAnswerSheetProto) => acc + (!hasWarning(curr.warnings, AnswerSheetIdMatchWarning.NO_MATCH) && !hasWarning(curr.warnings, AnswerSheetIdMatchWarning.UNAMBIGUOUS_MATCH) ? curr.files.length : 0), 0);
  }

  get numberOfFiles(): number {
    return this.uploadQueue.reduce((acc: number, curr:IAnswerSheetProto) => acc + curr.files.length, 0);
  }

  get numberOfDuplicateFiles(): number{
    return this.uploadQueue.reduce((acc: number, curr:IAnswerSheetProto) => acc + curr.files.reduce((a: number, c: IFileProto) => a + (hasWarning(c.warnings, AnswerSheetFileUploadWarning.DUPLICATE) ? 1 : 0), 0), 0);
  }

  get numberOfUnmatchesFiles(): number{
    return this.uploadQueue.reduce((acc: number, curr:IAnswerSheetProto) => acc + (hasWarning(curr.warnings, AnswerSheetIdMatchWarning.NO_MATCH) || hasWarning(curr.warnings, AnswerSheetIdMatchWarning.UNAMBIGUOUS_MATCH) ? curr.files.length : 0), 0);
  }

  severityComparator = (valA: any, valB: any, rowA: IAnswerSheetProto, rowB: IAnswerSheetProto) => {
    const warningsA: (AnswerSheetFileUploadWarning | AnswerSheetIdMatchWarning)[] = this.getAllWarnings(rowA);
    const warningsB: (AnswerSheetFileUploadWarning | AnswerSheetIdMatchWarning)[] = this.getAllWarnings(rowB);
    for(let currentSeverity = highestSeverityLevel; currentSeverity > 0; currentSeverity--) {
      const severityCountA: number = this.countBySeverityLevel(warningsA, currentSeverity);
      const severityCountB: number = this.countBySeverityLevel(warningsB, currentSeverity);
      if(severityCountA < severityCountB || severityCountA > severityCountB) return severityCountA - severityCountB;
    }
    return 0;
  }

  private countBySeverityLevel(warnings: (AnswerSheetFileUploadWarning | AnswerSheetIdMatchWarning)[], level: number): number {
    return warnings.filter((warning) => warningSeverities[warning] === level).length;
  }

  private getAllWarnings(row: IAnswerSheetProto): (AnswerSheetFileUploadWarning | AnswerSheetIdMatchWarning)[] {
    return [...row.warnings, ...row.files.map(file => file.warnings).flat()];
  }

  sorts: SortPropDir[] = [
    {
      prop: 'warnings',
      dir: 'desc'
    }
  ];

  protected readonly environment = environment;
  protected readonly Math = Math;
  protected readonly dataTableDefaultMessages = dataTableDefaultMessages;
  protected readonly AnswerSheetIdMatchWarning = AnswerSheetIdMatchWarning;
  protected readonly AnswerSheetFileUploadWarning = AnswerSheetFileUploadWarning;
  protected readonly hasWarning = hasWarning;
}
