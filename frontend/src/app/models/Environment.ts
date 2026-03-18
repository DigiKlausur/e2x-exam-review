export interface Environment {
  apiUrl: string;
  studentIdRegex: string;
  openId: {
    authorityUrl: string;
    clientId: string;
    mappings: {
      displayName: string;
      firstname: string;
      lastname: string;
      email: string;
      studentId: string;
    }
  }
}
