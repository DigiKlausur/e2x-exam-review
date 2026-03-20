import {Environment} from '../app/models/Environment';

export const environment: Environment = {
  apiUrl: 'http://localhost:3000',
  studentIdRegex: '(?:^|\\D)(90[\\d]{5})(?:$|\\D)',
  openId: {
    authorityUrl: '',
    clientId: '',
    attributeMappings: {
      studentId: '',
      displayName: '',
      firstname: '',
      lastname: '',
      email: ''
    },
    roleMappings: {
      lecturer: 'lecturer',
      student: 'student'
    }
  }
};
