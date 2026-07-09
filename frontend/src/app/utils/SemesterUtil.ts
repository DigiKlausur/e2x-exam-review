import {ISemester, Season} from 'e2x-exam-review-backend';

const semesterNames: Record<'en'|'de', Record<Season, string>> = {
  'en': {
    [Season.SUMMER]: 'Summer Semester',
    [Season.WINTER]: 'Winter Semester'
  },
  'de': {
    [Season.SUMMER]: 'Sommersemester',
    [Season.WINTER]: 'Wintersemester'
  }
}

export function getFullSemesterName(semester: ISemester, locale: 'en' | 'de' | 'en-US'): string {
  return `${semesterNames[locale.split('-')[0] as 'en' | 'de'][semester.season]} ${semester.year}`
}
