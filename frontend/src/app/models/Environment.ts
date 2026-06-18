export interface Environment {
  apiUrl: string;
  imprintUrl: string;
  privacyUrl: string;
  bugReportEmail: string;
  studentIdRegex: string;
  openId: {
    authorityUrl: string;
    clientId: string;
    attributeMappings: {
      uniqueId: string;
      displayName: string;
      firstname: string;
      lastname: string;
      email: string;
      studentId: string;
      roles: string;
    },
    roleMappings: {
      lecturer: string;
      student: string;
    },
    scopes: string[]
  }
}
