import {Environment} from '../app/models/Environment';

export const environment: Environment = {
  apiUrl: 'http://localhost:3000',
  studentIdRegex: '(?:^|\\D)(90[\\d]{5})(?:$|\\D)',
  openId: {
    authorityUrl: '',
    clientId: '',
    mappings: {
      studentId: '',
      displayName: '',
      firstname: '',
      lastname: '',
      email: ''
    }
  }
};
