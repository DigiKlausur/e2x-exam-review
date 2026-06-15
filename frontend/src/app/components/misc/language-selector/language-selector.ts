import {Component, inject, LOCALE_ID} from '@angular/core';

@Component({
  selector: 'app-language-selector',
  imports: [],
  templateUrl: './language-selector.html',
  styleUrl: './language-selector.scss',
})
export class LanguageSelector {
  currentLocale: string = inject(LOCALE_ID);

  languages: {code: string, name: string}[] = [
    {code: 'en', name: 'English'},
    {code: 'de', name: 'Deutsch'},
  ];

  selectLanguage(event: MouseEvent, code: string): void {
    event.preventDefault();
    if(code === this.currentLocale) return;
    window.location.pathname = window.location.pathname.replace(`/${this.currentLocale}`, `/${code}`);
  }
}
