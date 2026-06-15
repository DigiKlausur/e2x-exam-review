import {Component, inject, Input, OnInit} from '@angular/core';
import {NgxExtendedPdfViewerModule} from "ngx-extended-pdf-viewer";
import {IAnswerSheet, IFile} from 'e2x-exam-review-backend';
import {environment} from '../../../../environments/environment';
import {OidcSecurityService} from 'angular-auth-oidc-client';

enum loadingStates {
  INITIAL,
  LOADING,
  LOADED,
  FAILED
}

const loadingMessages: Record<loadingStates, string> = {
  [loadingStates.INITIAL]: $localize`:@@app.spinner.pdf-viewer.message.authenticating:Authenticating...`,
  [loadingStates.LOADING]: $localize`:@@app.spinner.pdf-viewer.message.loading:Loading...`,
  [loadingStates.LOADED]: $localize`:@@app.spinner.pdf-viewer.message.loading-finished:Loading finished!`,
  [loadingStates.FAILED]: $localize`:@@app.spinner.pdf-viewer.message.loading-failed:Failed to load!`
};

@Component({
  selector: 'app-answer-sheet-viewer',
    imports: [
        NgxExtendedPdfViewerModule
    ],
  templateUrl: './answer-sheet-viewer.html',
  styleUrl: './answer-sheet-viewer.scss',
})
export class AnswerSheetViewer implements OnInit {
  private readonly oidcSecurityService: OidcSecurityService = inject(OidcSecurityService);

  @Input() answerSheet!: IAnswerSheet;
  @Input() file!: IFile;
  protected readonly environment = environment;
  protected loadingState: loadingStates = loadingStates.INITIAL;

  accessToken?: string;

  ngOnInit(): void {
    this.oidcSecurityService.getAccessToken().subscribe((accessToken: string) => {
      this.accessToken = 'Bearer ' + accessToken;
    });
  }

  get fileUrl(): string {
    return `${environment.apiUrl}/${this.file.filePath}`;
  }

  protected readonly loadingStates = loadingStates;
  protected readonly loadingMessages = loadingMessages;
}
