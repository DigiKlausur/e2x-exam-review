import {Environment} from '../app/models/Environment';

export const environment: Environment = {
  apiUrl: 'http://localhost:3000',
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
