import {Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {ManagementService} from '../../../services/management-service/management-service';
import {IAnswerSheet} from 'e2x-exam-review-backend';
import {ToastService} from '../../../services/toast-service/toast-service';
import {
  FS as zipFS,
  fs as zipFsFactory,
  ZipEntry,
  ZipDirectoryEntry, ZipFileEntry
} from '@zip.js/zip.js';

export const SUPPORTED_ZIP_FORMATS: string[] = ['application/zip', 'application/x-zip-compressed'];

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

  handleDragLeave(): void {
    this.dropZone.nativeElement.classList.remove('dragover');
  }

  handleDrop(dragEvent: DragEvent): void {
    dragEvent.preventDefault();
    dragEvent.stopPropagation();
    this.dropZone.nativeElement.classList.remove('dragover');
    if (!dragEvent.dataTransfer?.files) return;
    this.handleUpload(dragEvent.dataTransfer?.files);
  }

  handleUpload(files: FileList): void | Promise<void> {
    if ([...files].every((file: File) => file.type === 'application/pdf')) {
      return this.addAnswerSheets(files);
    } else if (files.length === 1 && SUPPORTED_ZIP_FORMATS.includes(files.item(0)?.type ?? '')) {
      return this.readZipArchive(files.item(0)!);
    }
    this.toastService.show({
      header: $localize`:@@app.toast.header.answer-sheet-upload:Answer Sheet Upload`,
      body: $localize`:@@app.toast.body.answer-sheet-upload-failed.unsupported-format:Unable to upload files, as they does not match the supported formats!`,
      classname: 'bg-danger text-white',
      delay: -1,
    });
  }

  addAnswerSheets(files: FileList): void {
    Promise.allSettled(
      Array.from(files).map(async (file: File) => {
        return new Promise<IAnswerSheet>(async (resolve, reject) => {
          if (file.type !== 'application/pdf') {
            const e = `<${file.name}> file type is not supported`;
            this.showWarning(e);
            return reject(e);
          }
          const matches: string[] = this.matchStudentId(file.name);
          if (matches && matches.length > 1) {
            const e = `<${file.name}> student ID is not unambiguous`;
            this.showWarning(e);
            return reject(e);
          }
          if (matches.length < 1) {
            const e = `<${file.name}> student ID could not be identified`;
            this.showWarning(e);
            return reject(e);
          }
          this.managementService.addAnswerSheet(this.examId, matches[0], [file]).subscribe({
            next: (response) => resolve(response),
            error: (error) => {
              this.showWarning(
                error.error.error
                  ? `student ${matches[0]} <${file.name}> ${error.error.error}`
                  : undefined,
              );
              reject(error);
            },
          });
        });
      }),
    )
      .then((results) => {
        this.toastService.show({
          header: $localize`:@@app.toast.header.answer-sheet-upload:Answer Sheet Upload`,
          body: $localize`:@@app.toast.body.answer-sheet-upload-successful:Upload finished: ${results.reduce((acc, cur) => (cur.status === 'fulfilled' ? acc + 1 : acc), 0)} / ${files.length} uploads successful`,
        });
      })
      .finally(() => {
        this.onChange.emit();
      });
  }

  async readZipArchive(file: File): Promise<void> {
    const zFs: zipFS = new zipFsFactory.FS();
    await zFs.importBlob(file);
    const rootDirectory =
      zFs.children.length === 1 && this.matchStudentId(zFs.children[0].name).length === 0
        ? zFs.children[0]
        : zFs.root; //if there is only one directory inside the root of the zip, that does not contain a student-ID in its name -> assume it's the actual root
    const submitterDirectories: ZipDirectoryEntry[] = rootDirectory.children.filter(
      (child: ZipEntry) => (child as ZipDirectoryEntry).directory ?? false,
    ) as ZipDirectoryEntry[];
    let numberOfSubmitters: number = 0;
    await Promise.allSettled(
      submitterDirectories.map(async (directory: ZipDirectoryEntry) => {
        const studentIdMatches = this.matchStudentId(directory.name);
        if (studentIdMatches.length !== 1) {
          this.showWarning(`Student ID could not be found in directory-name <${directory.name}>`);
          return Promise.reject(
            $localize`:@@app.error.student-id-not-matched:student ID could not be matched (directory-name: ${directory.name})`,
          );
        }
        numberOfSubmitters++;

        const files: File[] = await Promise.all(
          directory.children
            .filter(
              (child: ZipEntry) =>
                !(child as ZipDirectoryEntry).directory && child.name.endsWith('.pdf'),
            )
            .map(
              async (entry: ZipEntry) =>
                new File(
                  [await (entry as ZipFileEntry<Blob, Blob>).getBlob()],
                  entry.getFullname(),
                ),
            ),
        );

        return new Promise<IAnswerSheet>((resolve, reject) => {
          this.managementService.addAnswerSheet(this.examId, studentIdMatches[0], files).subscribe({
            next: (response) => resolve(response),
            error: (error) => {
              this.showWarning(
                error.error.error
                  ? `student ${studentIdMatches[0]} <${files.map((file) => file.name).join('>, <')}> ${error.error.error}`
                  : undefined,
              );
              reject(error);
            },
          });
        });
      }),
    )
      .then((results) => {
        this.toastService.show({
          header: $localize`:@@app.toast.header.answer-sheet-upload:Answer Sheet Upload`,
          body: $localize`:@@app.toast.body.answer-sheet-upload-successful.zip:Upload finished: ${results.reduce((acc, cur) => (cur.status === 'fulfilled' ? acc + 1 : acc), 0)} / ${numberOfSubmitters} uploads successful`,
        });
      })
      .finally(() => {
        this.onChange.emit();
      });
  }

  showWarning(message?: string): void {
    this.toastService.show({
      header: $localize`:@@app.toast.header.answer-sheet-upload:Answer Sheet Upload`,
      body:
        $localize`:@@app.toast.body.answer-sheet-upload-failed.warning:Failed to upload answer sheet: ` +
        (message ?? '[unknown error]'),
      classname: 'bg-danger text-white',
      delay: -1,
    });
  }

  handleFileInputChange(event: Event) {
    const files: FileList | null = (event.target as HTMLInputElement).files;
    if (files) this.handleUpload(files);
  }

  private matchStudentId(str: string): string[] {
    const studentIdRegex: RegExp = new RegExp(environment.studentIdRegex, 'g');
    return [...str.matchAll(studentIdRegex)].map((match: RegExpExecArray) => match[1]);
  }
}
