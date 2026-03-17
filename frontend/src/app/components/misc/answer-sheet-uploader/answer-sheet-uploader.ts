import {Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {ManagementService} from '../../../services/management-service/management-service';
import {IAnswerSheet, IExam} from 'e2xgrader-exam-review-backend';
import {prepareExam} from '../../../utils/ExamUtil';

@Component({
  selector: 'app-answer-sheet-uploader',
  imports: [],
  templateUrl: './answer-sheet-uploader.html',
  styleUrl: './answer-sheet-uploader.scss',
})
export class AnswerSheetUploader {
  private managementService: ManagementService = inject(ManagementService);

  @Input() examId!: string;
  @Output() onChange: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('dropZone') dropZone!: ElementRef<HTMLDivElement>;

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
    Promise.all(Array.from(files).map(async (file: File) => {
      return new Promise<IAnswerSheet>(async (resolve, reject) => {
        if(file.type !== 'application/pdf') {
          return reject(`${file.name}: file type is not supported`);
        }
        const matches: RegExpExecArray[] = [...file.name.matchAll(studentIdRegex)];
        if(matches && matches.length > 1){
          return reject(`${file.name}: student ID is not unambiguous`);
        }
        if(matches.length < 1){
          return reject(`${file.name}: student ID could not be identified`);
        }
        this.managementService.addAnswerSheet(this.examId, matches[0][1], file).subscribe({
          next: response => resolve(response),
          error: error => reject(error)
        });
      });
    }))
      .finally(() => this.onChange.emit());
  }
}
