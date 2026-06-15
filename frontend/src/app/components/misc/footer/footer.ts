import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {LanguageSelector} from '../language-selector/language-selector';

@Component({
  selector: 'app-footer',
  imports: [
    LanguageSelector
  ],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected readonly environment = environment;

  startBugReport(): void {
    const mailUrl =
      'mailto:' +
      environment.bugReportEmail +
      '?subject=e2x exam review - bug report' +
      '&body=' +
      encodeURI(
        'Circumstances:\nTimestamp: ' +
          new Date() +
          '\nCurrent URL: ' +
          window.location.href +
          '\n\n Please describe the problem as detailed, as you can:\nWhat did you try to do?\n\nWhich behavior did you expect?\n\nWhat actually happened?\n',
      );
    window.open(mailUrl, '_blank');
  }
}
