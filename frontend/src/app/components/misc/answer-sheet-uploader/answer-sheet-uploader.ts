import {
  ChangeDetectorRef,
  Component, ElementRef,
  EventEmitter,
  inject,
  Input,
  Output, signal, TemplateRef,
  ViewChild,
  WritableSignal
} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {ManagementService} from '../../../services/management-service/management-service';
import {IAnswerSheet, IFile} from 'e2x-exam-review-backend';
import {ToastService} from '../../../services/toast-service/toast-service';
import {
  FS as zipFS,
  fs as zipFsFactory,
  ZipEntry,
  ZipDirectoryEntry, ZipFileEntry, getMimeType
} from '@zip.js/zip.js';
import {AnswerSheetUploadPreview} from '../answer-sheet-upload-preview/answer-sheet-upload-preview';
import {IAnswerSheetProto} from '../../../models/IAnswerSheetProto';
import {AnswerSheetFileUploadWarning} from '../../../enums/AnswerSheetFileUploadWarning';
import {AnswerSheetIdMatchWarning} from '../../../enums/AnswerSheetIdMatchWarning';
import {IFileProto} from '../../../models/IFileProto';
import {hasWarning} from '../../../utils/UploadUtil';
import {Toast} from '../../../models/Toast';
import {NgbProgressbar} from '@ng-bootstrap/ng-bootstrap';
import {default as PQueue} from 'p-queue';

export const SUPPORTED_ZIP_FORMATS: string[] = ['application/zip', 'application/x-zip-compressed'];

@Component({
  selector: 'app-answer-sheet-uploader',
  imports: [
    AnswerSheetUploadPreview,
    NgbProgressbar
  ],
  templateUrl: './answer-sheet-uploader.html',
  styleUrl: './answer-sheet-uploader.scss',
})
export class AnswerSheetUploader {
  private managementService: ManagementService = inject(ManagementService);
  private toastService: ToastService = inject(ToastService);
  private changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);

  private zipUploadMode: boolean = false;
  protected loadingPreview: boolean = false;

  @Input() examId!: string;
  @Input() existingAnswerSheets: IAnswerSheet[] = [];
  uploadQueue: IAnswerSheetProto[] = [];

  @Output() onChange: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('dropZone') dropZone!: ElementRef<HTMLDivElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('uploadProgressBody') uploadProgressBody!: TemplateRef<HTMLDivElement>;

  handleDragOver(dragEvent: DragEvent): void {
    dragEvent.preventDefault();
    dragEvent.stopPropagation();
    this.dropZone.nativeElement.classList.add('dragover');
  }

  handleDragLeave(): void {
    this.dropZone.nativeElement.classList.remove('dragover');
  }

  async handleDrop(dragEvent: DragEvent): Promise<void> {
    dragEvent.preventDefault();
    dragEvent.stopPropagation();
    this.dropZone.nativeElement.classList.remove('dragover');
    if (!dragEvent.dataTransfer?.files) return;
    await this.handleUpload(dragEvent.dataTransfer?.files);
  }

  async handleUpload(files: FileList): Promise<void> {
    const loadingFinished = () => {
      this.loadingPreview = false;
      this.changeDetectorRef.detectChanges();
    }

    this.loadingPreview = true;
    if ([...files].every((file: File) => file.type === 'application/pdf')) {
      this.addAnswerSheets(files);
      loadingFinished();
      return ;
    } else if (files.length === 1 && SUPPORTED_ZIP_FORMATS.includes(files.item(0)?.type ?? '')) {
      await this.readZipArchive(files.item(0)!);
      loadingFinished();
      return ;
    }
    loadingFinished();
    this.toastService.show({
      header: $localize`:@@app.toast.header.answer-sheet-upload:Graded Exam Upload`,
      body: $localize`:@@app.toast.body.answer-sheet-upload-failed.unsupported-format:Unable to upload files, as they do not match the supported formats!`,
      classname: 'bg-danger text-white',
      delay: -1,
    });
  }

  clearUploadQueue(): void {
    this.uploadQueue = [];
  }

  enqueueAnswerSheet(answerSheetProto: IAnswerSheetProto): void {
    const existingAnswerSheet: IAnswerSheetProto | undefined = this.uploadQueue.find(exAnswerSheet => exAnswerSheet.studentId === answerSheetProto.studentId && this.warningsMatch(exAnswerSheet.warnings, answerSheetProto.warnings));
    if(existingAnswerSheet) existingAnswerSheet.files.push(...answerSheetProto.files);
    else this.uploadQueue.push(answerSheetProto);
  }

  warningsMatch(warningsA: AnswerSheetIdMatchWarning[], warningsB: AnswerSheetIdMatchWarning[]): boolean {
    if(warningsA.length !== warningsB.length) return false;
    for(const wA of warningsA) {
      if(!warningsB.includes(wA)) return false;
    }
    return true;
  }

  addAnswerSheets(files: FileList): void {
    this.zipUploadMode = false;
    this.clearUploadQueue();
    Array.from(files).forEach((file: File) => {
      this.checkAndEnqueueFiles(this.matchStudentId(file.name), [{name: file.name, pathName: file.name, type: file.type, getFile: () => Promise.resolve(file)}]);
    });
  }

  checkAndEnqueueFiles(studentIdMatches: string[], files: {name: string, pathName: string, type: string, getFile: () => Promise<File>}[]): void{
    const answerSheetProto: IAnswerSheetProto = {
      examId: this.examId,
      studentId: studentIdMatches.length === 1 ? studentIdMatches[0] : undefined,
      files: [] as IFileProto[],
      warnings: [] as AnswerSheetIdMatchWarning[]
    }

    if (studentIdMatches.length > 1) {
      answerSheetProto.warnings.push(AnswerSheetIdMatchWarning.UNAMBIGUOUS_MATCH);
    }else if (studentIdMatches.length < 1) {
      answerSheetProto.warnings.push(AnswerSheetIdMatchWarning.NO_MATCH);
    } else {
      answerSheetProto.studentId = studentIdMatches[0];
    }

    answerSheetProto.files = files.map((file: {name: string, pathName:string, type: string, getFile: () => Promise<File>}): IFileProto => {
      const fileProto = {name: file.name, pathName: file.pathName, getFile: file.getFile, warnings: [] as AnswerSheetFileUploadWarning[]};
      if (file.type !== 'application/pdf') {
        fileProto.warnings.push(AnswerSheetFileUploadWarning.INVALID_TYPE);
      }
      if(this.existingAnswerSheets
        .find((answerSheet: IAnswerSheet) => answerSheet.submitter.studentId?.toString() === answerSheetProto.studentId)
        ?.files.find((existingFile: IFile) => existingFile.originalFileName === file.name)
      ){
        fileProto.warnings.push(AnswerSheetFileUploadWarning.DUPLICATE);
      }
      return fileProto;
    });
    this.enqueueAnswerSheet(answerSheetProto);
  }

  async readZipArchive(file: File): Promise<void> {
    this.zipUploadMode = true;
    this.clearUploadQueue();
    const zFs: zipFS = new zipFsFactory.FS();
    await zFs.importBlob(file);
    const rootDirectory =
      zFs.children.length === 1 && this.matchStudentId(zFs.children[0].name).length === 0
        ? zFs.children[0]
        : zFs.root; //if there is only one directory inside the root of the zip, that does not contain a student-ID in its name -> assume it's the actual root
    const submitterDirectories: ZipDirectoryEntry[] = rootDirectory.children.filter(
      (child: ZipEntry) => (child as ZipDirectoryEntry).directory ?? false,
    ) as ZipDirectoryEntry[];

    submitterDirectories.forEach((directory: ZipDirectoryEntry) => {
      this.checkAndEnqueueFiles(
        this.matchStudentId(directory.name),
        directory.children
          .filter((child: ZipEntry) => !(child as ZipDirectoryEntry).directory)
          .map(
            (entry: ZipEntry) => {
              const fileName: string = entry.getRelativeName(directory);
              const fileType: string = getMimeType(entry.name);
              return {
                name: fileName,
                pathName: entry.getFullname(),
                type: fileType,
                getFile: async () => new File(
                  [await(entry as ZipFileEntry<Blob, Blob>).getBlob()],
                  fileName,
                  {type: fileType}
                )
              }
            }
          )
      );
    });
  }

  protected numberOfAnswerSheets: number = 0;
  protected overallNumberOfFiles: number = 0;
  protected numberOfUploadedAnswerSheets: WritableSignal<number> = signal<number>(0);
  protected numberOfUploadedFiles: WritableSignal<number> = signal<number>(0);
  protected numberOfUploadErrors: WritableSignal<number> = signal<number>(0);

  async performUpload(duplicateHandlingStrategy: 'dismiss'|'overwrite'): Promise<void>{
    const preparedData = (this.uploadQueue.filter((answerSheetProto: IAnswerSheetProto) => answerSheetProto.studentId && answerSheetProto.warnings.length === 0) as Required<IAnswerSheetProto>[])
      .map((answerSheetProto: Required<IAnswerSheetProto>) => {
        answerSheetProto.files = answerSheetProto.files.filter((file: IFileProto) => (duplicateHandlingStrategy === 'dismiss' ? !hasWarning(file.warnings, AnswerSheetFileUploadWarning.DUPLICATE) : true) && !hasWarning(file.warnings, AnswerSheetFileUploadWarning.INVALID_TYPE));
        return answerSheetProto;
      })
      .filter((answerSheetProto: Required<IAnswerSheetProto>) => answerSheetProto.files.length > 0);

    this.numberOfAnswerSheets = preparedData.length;
    this.overallNumberOfFiles = preparedData.reduce((acc: number, current: IAnswerSheetProto) => acc + current.files.length,0);
    this.numberOfUploadedAnswerSheets.set(0);
    this.numberOfUploadedFiles.set(0);
    this.numberOfUploadErrors.set(0);
    const uploadErrorAnswerSheets: {answerSheet: IAnswerSheetProto, error: any}[] = [];

    const uploadProgressToast: Toast = {
      header: $localize`:@@app.toast.header.answer-sheet-upload:Graded Exam Upload`,
      body: this.uploadProgressBody,
      delay: -1
    };
    this.toastService.show(uploadProgressToast);

    const queue = new PQueue({concurrency: this.zipUploadMode ? 1 : environment.uploadConcurrency});

    await Promise.allSettled(
      preparedData
        .map(async (answerSheetProto: Required<IAnswerSheetProto>) => queue.add(() => new Promise<IAnswerSheet>(async (resolve, reject) => (await this.managementService.addAnswerSheet(answerSheetProto, duplicateHandlingStrategy === 'overwrite')).subscribe({
          next: (response) => {
            this.numberOfUploadedAnswerSheets.update((prev: number) => prev + 1);
            this.numberOfUploadedFiles.update((prev: number) => prev + answerSheetProto.files.length);
            resolve(response)
          },
          error: (error) => {
            this.numberOfUploadErrors.update((prev: number) => prev + answerSheetProto.files.length);
            uploadErrorAnswerSheets.push({answerSheet: answerSheetProto, error: error});
            reject(error);
          }
        }))))
    )
      .then(() => {
        if(uploadErrorAnswerSheets.length === 0) setTimeout(() => {this.toastService.remove(uploadProgressToast)}, 5000);
      })
      .finally(() => {
        if(uploadErrorAnswerSheets.length > 0) {
          this.toastService.show({
            header: $localize`:@@app.toast.header.answer-sheet-upload:Graded Exam Upload`,
            body: $localize`:@@app.warning.answer-sheet-upload-failure:The graded exams matching the following student IDs could not be uploaded: ${uploadErrorAnswerSheets.map(err => err.answerSheet.studentId).join(', ')} (more details about this error can be found in the browser console)`,
            classname: 'bg-danger text-white',
            delay: -1,
          });
          uploadErrorAnswerSheets.forEach(err => console.error(`unable to upload the graded exam of ${err.answerSheet.studentId}`, err.error, err.answerSheet));
        }
        this.clearUploadQueue();
        this.onChange.emit();
      });
  }

  async handleFileInputChange(event: Event): Promise<void> {
    const files: FileList | null = (event.target as HTMLInputElement).files;
    if (files) await this.handleUpload(files);
  }

  private matchStudentId(str: string): string[] {
    const studentIdRegex: RegExp = new RegExp(environment.studentIdRegex, 'g');
    return [...str.matchAll(studentIdRegex)].map((match: RegExpExecArray) => match[1]);
  }
}
