import {Environment} from '../app/models/Environment';

export const environment: Environment = {
  apiUrl: 'http://localhost:3000',
  imprintUrl: 'https://www.h-brs.de/en/kum/imprint',
  privacyUrl: 'https://www.h-brs.de/en/data-privacy-statement',
  bugReportEmail: '',
  studentIdRegex: '(?<!\\d)(90[\\d]{5})(?!\\d)',
  uploadConcurrency: 5,
  openId: {
    authorityUrl: 'http://localhost:16520/auth/realms/e2x-exam-review',
    clientId: 'e2x-exam-review-client',
    attributeMappings: {
      uniqueId: 'email',
      studentId: 'studentId',
      displayName: 'name',
      firstname: 'given_name',
      lastname: 'family_name',
      email: 'email',
      roles: 'roles'
    },
    roleMappings: {
      lecturer: 'lecturer',
      student: 'student',
    },
    scopes: ['openid', 'profile', 'offline_access']
  },
  dataTable: {
    rowsPerPage: 10,
    footerMinRows: 5
  }
};
