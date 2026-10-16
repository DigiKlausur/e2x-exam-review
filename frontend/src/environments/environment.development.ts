import {Environment} from '../app/models/Environment';

export const environment: Environment = {
  apiUrl: 'http://localhost:3000',
  imprintUrl: 'https://www.h-brs.de/en/kum/imprint',
  privacyUrl: 'https://www.h-brs.de/en/data-privacy-statement',
  bugReportEmail: '',
  studentIdRegex: '(?<!\\d)(90[\\d]{5})(?!\\d)',
  uploadConcurrency: 5,
  keycloak: {
    url: 'http://localhost:8080/auth',
    realm: 'e2x-exam-review',
    clientId: 'e2x-exam-review-dev',
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
