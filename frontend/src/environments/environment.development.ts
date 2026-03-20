import {Environment} from '../app/models/Environment';

export const environment: Environment = {
  apiUrl: 'http://localhost:3000',
  studentIdRegex: '(?:^|\\D)(90[\\d]{5})(?:$|\\D)',
  openId: {
    authorityUrl: 'http://localhost:8080/auth/realms/e2x-exam-review',
    clientId: 'e2x-exam-review-client',
    attributeMappings: {
      studentId: 'studentId',
      displayName: 'name',
      firstname: 'given_name',
      lastname: 'family_name',
      email: 'email'
    },
    roleMappings: {
      lecturer: 'lecturer',
      student: 'student'
    }
  }
};
