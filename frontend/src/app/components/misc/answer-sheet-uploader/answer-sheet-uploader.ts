import {Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-answer-sheet-uploader',
  imports: [],
  templateUrl: './answer-sheet-uploader.html',
  styleUrl: './answer-sheet-uploader.scss',
})
export class AnswerSheetUploader {

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
    console.log(dragEvent.dataTransfer?.files);
  }
}
