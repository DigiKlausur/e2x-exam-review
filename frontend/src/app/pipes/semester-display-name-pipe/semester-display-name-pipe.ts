import {inject, LOCALE_ID, Pipe, PipeTransform} from '@angular/core';
import { Semester, Season } from "e2xgrader-review-backend";

const semesterNames: Record<'en'|'de', Record<Season, string>> = {
   'en': {
     [Season.SUMMER]: 'Spring Semester',
     [Season.WINTER]: 'Winter Semester'
   },
   'de': {
     [Season.SUMMER]: 'Sommersemester',
     [Season.WINTER]: 'Wintersemester'
   }
}

@Pipe({
  name: 'semesterDisplayName',
})
export class SemesterDisplayNamePipe implements PipeTransform {
  private currentLocaleId: string = inject(LOCALE_ID);
  transform(value: Semester, localeId: 'en'|'de'|'en-US' = (this.currentLocaleId as 'en' | 'de' | 'en-US') ?? 'en'): string {
    return `${semesterNames[localeId.split('-')[0] as 'en'|'de'][value.season]} ${value.year}`
  }
}
