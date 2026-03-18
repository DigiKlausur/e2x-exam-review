export const config = {
    serverPort: process.env.SERVER_PORT ?? "3000",
    corsOrigin: process.env.ALLOWED_ORIGIN ?? 'http://localhost:4200',
    jwt: {
        secret: process.env.JWT_SECRET,
        issuer: process.env.JWT_ISSUER,
        roleMappings: {
            lecturer: process.env.JWT_LECTURER_ROLE ?? 'lecturer',
            student: process.env.JWT_STUDENT_ROLE ?? 'student'
        },
        attributeMappings: {
            email: process.env.JWT_EMAIL_ATTRIBUTE ?? 'email',
            studentId: process.env.JWT_STUDENT_ID_ATTRIBUTE ?? 'student-id'
        }
    },
    mongoDb: {
        username: process.env.MONGODB_USERNAME,
        password: process.env.MONGODB_PASSWORD,
        host: process.env.MONGODB_HOST ?? 'localhost',
        port: process.env.MONGODB_PORT ?? '27017',
        database: process.env.MONGODB_DATABASE_NAME ?? 'e2xExamReview',
    }
}
