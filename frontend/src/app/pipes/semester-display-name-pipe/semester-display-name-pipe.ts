import {inject, LOCALE_ID, Pipe, PipeTransform} from '@angular/core';
import { ISemester } from "e2xgrader-exam-review-backend";
import {getFullSemesterName} from '../../utils/SemesterUtil';

@Pipe({
  name: 'semesterDisplayName',
})
export class SemesterDisplayNamePipe implements PipeTransform {
  private currentLocaleId: string = inject(LOCALE_ID);
  transform(value: ISemester, localeId: 'en'|'de'|'en-US' = (this.currentLocaleId as 'en' | 'de' | 'en-US') ?? 'en'): string {
    return getFullSemesterName(value, localeId);
  }
}
