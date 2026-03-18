import {Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {ManagementService} from '../../../services/management-service/management-service';
import {IAnswerSheet, IExam} from 'e2xgrader-exam-review-backend';
import {prepareExam} from '../../../utils/ExamUtil';
import {ToastService} from '../../../services/toast-service/toast-service';

@Component({
  selector: 'app-answer-sheet-uploader',
  imports: [],
  templateUrl: './answer-sheet-uploader.html',
  styleUrl: './answer-sheet-uploader.scss',
})
export class AnswerSheetUploader {
  private managementService: ManagementService = inject(ManagementService);
  private toastService: ToastService = inject(ToastService);

  @Input() examId!: string;
  @Output() onChange: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('dropZone') dropZone!: ElementRef<HTMLDivElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  handleDragOver(dragEvent: DragEvent): void {
    dragEvent.preventDefault();
    dragEvent.stopPropagation();
    this.dropZone.nativeElement.classList.add('dragover');
  }

  handleDragLeave(): void{
    this.dropZone.nativeElement.classList.remove('dragover');
  }

  handleDrop(dragEvent: DragEvent): void{
    dragEvent.preventDefault();
    dragEvent.stopPropagation();
    this.dropZone.nativeElement.classList.remove('dragover');
    if(!dragEvent.dataTransfer?.files) return;
    this.addAnswerSheets(dragEvent.dataTransfer?.files);
  }

  addAnswerSheets(files: FileList): void {
    const studentIdRegex: RegExp = new RegExp(environment.studentIdRegex, 'g');
    Promise.allSettled(Array.from(files).map(async (file: File) => {
      return new Promise<IAnswerSheet>(async (resolve, reject) => {
        if(file.type !== 'application/pdf') {
          const e = `<${file.name}> file type is not supported`;
          this.showWarning(e);
          return reject(e);
        }
        const matches: RegExpExecArray[] = [...file.name.matchAll(studentIdRegex)];
        if(matches && matches.length > 1){
          const e = `<${file.name}> student ID is not unambiguous`;
          this.showWarning(e);
          return reject(e);
        }
        if(matches.length < 1){
          const e = `<${file.name}> student ID could not be identified`;
          this.showWarning(e);
          return reject(e);
        }
        this.managementService.addAnswerSheet(this.examId, matches[0][1], file).subscribe({
          next: response => resolve(response),
          error: error => {
            this.showWarning(error.error.error ? `<${file.name}> ${error.error.error}` : undefined);
            reject(error)
          }
        });
      });
    }))
    .then((results) => {
      this.toastService.show({
        header: 'Answer Sheet Upload',
        body: `Upload finished: ${results.reduce((acc, cur) => cur.status === 'fulfilled' ? acc + 1 : acc, 0)} / ${files.length} uploads successful`,
      });
    })
    .finally(() => {
      this.onChange.emit()
    });
  }

  showWarning(message?: string): void {
    this.toastService.show({
      header: 'Warning',
      body: 'Failed to upload answer sheet: ' + (message ?? '[unknown error]'),
      classname: 'bg-warning',
      delay: -1
    })
  }

  handleFileInputChange(event: Event) {
    const files: FileList | null = (event.target as HTMLInputElement).files;
    if(files) this.addAnswerSheets(files);
  }
}
