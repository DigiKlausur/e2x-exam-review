import {Environment} from '../app/models/Environment';

export const environment: Environment = {
  apiUrl: 'https://e2x-einsicht.inf.h-brs.de',
  imprintUrl: 'https://www.h-brs.de/en/kum/imprint',
  privacyUrl: 'https://www.h-brs.de/en/data-privacy-statement',
  bugReportEmail: 'e2x@h-brs.de',
  studentIdRegex: '(?<!\\d)(90[\\d]{5})(?!\\d)',
  openId: {
    authorityUrl: 'https://idp.h-brs.de/nidp/oauth/e2xeinsicht',
    clientId: '',
    attributeMappings: {
      uniqueId: 'preferred_username',
      studentId: 'matriculationnumber',
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
    scopes: ['openid', 'profile', 'offline_access', 'e2xeinsicht']
  },
};
