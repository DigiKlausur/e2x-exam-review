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
      displayName: string;
      firstname: string;
      lastname: string;
      email: string;
      studentId: string;
    },
    roleMappings: {
      lecturer: string;
      student: string;
    }
  }
}
