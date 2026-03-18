import {Component, inject, Input, OnInit} from '@angular/core';
import {NgxExtendedPdfViewerModule} from "ngx-extended-pdf-viewer";
import {IAnswerSheet} from 'e2xgrader-exam-review-backend';
import {environment} from '../../../../environments/environment';
import {OidcSecurityService} from 'angular-auth-oidc-client';

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
  protected readonly environment = environment;

  accessToken?: string;

  ngOnInit(): void {
    this.oidcSecurityService.getAccessToken().subscribe((accessToken: string) => {
      this.accessToken = 'Bearer ' + accessToken;
    });
  }
}
