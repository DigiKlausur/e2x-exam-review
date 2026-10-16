import {Environment} from '../app/models/Environment';

export const environment: Environment = {
  apiUrl: 'https://e2x-einsicht.inf.h-brs.de',
  imprintUrl: 'https://www.h-brs.de/en/kum/imprint',
  privacyUrl: 'https://www.h-brs.de/en/data-privacy-statement',
  bugReportEmail: 'e2x@h-brs.de',
  studentIdRegex: '(?<!\\d)(90[\\d]{5})(?!\\d)',
  uploadConcurrency: 5,
  keycloak: {
    url: 'https://diarchitect.inf.h-brs.de/auth',
    realm: 'e2x-exam-review',
    clientId: 'e2x-exam-review',
    attributeMappings: {
      uniqueId: 'preferred_username',
      studentId: 'student_id',
      displayName: 'name',
      firstname: 'given_name',
      lastname: 'family_name',
      email: 'email',
      roles: 'roles'
    },
    roleMappings: {
      lecturer: 'lecturer',
      student: 'student',
    }
  },
  dataTable: {
    rowsPerPage: 10,
    footerMinRows: 5
  }
};
