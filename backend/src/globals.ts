import * as path from 'path';

export const config = {
  serverPort: process.env.SERVER_PORT ?? "3000",
  corsOrigin: process.env.ALLOWED_ORIGIN ?? "http://localhost:4200",
  fileStorageLocation: path.resolve(process.env.FILE_STORAGE_LOCATION ?? './answer-sheets'),
  jwt: {
    openIdConfigUrl: process.env.OPENID_CONFIG_URL,
    secret: process.env.JWT_SECRET,
    issuer: process.env.JWT_ISSUER,
    roleMappings: {
      lecturer: process.env.JWT_LECTURER_ROLE ?? "lecturer",
      student: process.env.JWT_STUDENT_ROLE ?? "student",
    },
    attributeMappings: {
      uniqueId: process.env.JWT_UNIQUE_ID ?? "email",
      email: process.env.JWT_EMAIL_ATTRIBUTE ?? "email",
      studentId: process.env.JWT_STUDENT_ID_ATTRIBUTE ?? "student_id",
      firstname: process.env.JWT_FIRSTNAME ?? "given_name",
      lastname: process.env.JWT_LASTNAME ?? "family_name",
      roles: process.env.JWT_ROLES ?? "roles",
    },
  },
  mongoDb: {
    username: process.env.MONGODB_USERNAME,
    password: process.env.MONGODB_PASSWORD,
    host: process.env.MONGODB_HOST ?? "localhost",
    port: process.env.MONGODB_PORT ?? "27017",
    database: process.env.MONGODB_DATABASE_NAME ?? "e2xExamReview",
  },
  limits: {
    maxFilesPerAnswerSheet: process.env.MAX_FILES_PER_ANSWER_SHEET ?? 64
  }
};
