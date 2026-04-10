import {Component, EventEmitter, inject, Input, Output, ViewChild} from '@angular/core';
import {IAnswerSheet, IFile} from "e2x-exam-review-backend";
import {NgbModal, NgbModalRef, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {RouterLink} from '@angular/router';
import {ManagementService} from '../../../services/management-service/management-service';
import {UserDisplayNamePipe} from '../../../pipes/user-display-name-pipe/user-display-name-pipe';
import {ToastService} from '../../../services/toast-service/toast-service';

@Component({
  selector: 'app-answer-sheet-list',
  templateUrl: './answer-sheet-list.html',
  styleUrl: './answer-sheet-list.scss',
  imports: [
    NgbTooltip,
    RouterLink,
    UserDisplayNamePipe
  ]
})
export class AnswerSheetList {
  private managementService: ManagementService = inject(ManagementService);
  private modalService: NgbModal = inject(NgbModal);
  private toastService: ToastService = inject(ToastService);
  @Input() answerSheets: IAnswerSheet[] = [];
  @Output() onChange: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('confirmDeleteAnswerSheetModal') confirmDeleteAnswerSheetModal!: NgbModal;
  @ViewChild('confirmDeleteAnswerSheetFileModal') confirmDeleteAnswerSheetFileModal!: NgbModal;

  confirmDeleteModalRef?: NgbModalRef;

  selectedAnswerSheet?: IAnswerSheet;
  selectedFile?: IFile;

  handleDeleteAnswerSheet(answerSheet: IAnswerSheet) {
    this.selectedAnswerSheet = answerSheet;

    this.confirmDeleteModalRef = this.modalService.open(this.confirmDeleteAnswerSheetModal, {size: 'md'});
    this.confirmDeleteModalRef.result
      .finally(() => this.selectedAnswerSheet = undefined);
  }

  confirmDeleteAnswerSheet() {
    if(!this.selectedAnswerSheet) return;
    this.managementService.deleteAnswerSheet(this.selectedAnswerSheet._id!).subscribe(result => {
      this.onChange.emit();
      this.confirmDeleteModalRef?.close();
      this.toastService.show({header: 'Delete Answer Sheet', body: 'Answer sheet deleted successfully'});
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
    this.managementService.deleteAnswerSheetFile(this.selectedAnswerSheet._id!, this.selectedFile._id!).subscribe(result => {
      this.onChange.emit();
      this.confirmDeleteModalRef?.close();
      this.toastService.show({header: 'Delete Answer Sheet File', body: 'File deleted successfully'});
    });
  }

  get numberOfFiles(): number {
    return this.answerSheets.reduce((acc: number, curr: IAnswerSheet) => acc + curr.files.length, 0);
  }
}
