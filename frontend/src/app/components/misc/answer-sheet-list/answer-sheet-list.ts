import {Component, EventEmitter, inject, Input, Output, ViewChild} from '@angular/core';
import { IAnswerSheet } from "e2x-exam-review-backend";
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

  @ViewChild('confirmDeleteModal') confirmDeleteModal!: NgbModal;
  confirmDeleteModalRef?: NgbModalRef;

  selectedAnswerSheet?: IAnswerSheet;

  handleDeleteAnswerSheet(answerSheet: IAnswerSheet) {
    this.selectedAnswerSheet = answerSheet;

    this.confirmDeleteModalRef = this.modalService.open(this.confirmDeleteModal, {size: 'md'});
    this.confirmDeleteModalRef.result
      .finally(() => this.selectedAnswerSheet = undefined);
  }

  confirmDelete() {
    if(!this.selectedAnswerSheet) return;
    this.managementService.deleteAnswerSheet(this.selectedAnswerSheet._id!).subscribe(result => {
      this.onChange.emit();
      this.confirmDeleteModalRef?.close();
      this.toastService.show({header: 'Delete Answer Sheet', body: 'Answer sheet deleted successfully'});
    });
  }
}
