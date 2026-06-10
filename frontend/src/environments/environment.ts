import {Environment} from '../app/models/Environment';

export const environment: Environment = {
  apiUrl: 'http://localhost:3000',
  imprintUrl: 'https://www.h-brs.de/en/kum/imprint',
  privacyUrl: 'https://www.h-brs.de/en/data-privacy-statement',
  bugReportEmail: 'e2x@h-brs.de',
  studentIdRegex: '(?<!\\d)(90[\\d]{5})(?!\\d)',
  openId: {
    authorityUrl: '',
    clientId: '',
    attributeMappings: {
      studentId: '',
      displayName: '',
      firstname: '',
      lastname: '',
      email: '',
    },
    roleMappings: {
      lecturer: 'lecturer',
      student: 'student',
    },
  },
};
