# e2x-exam-review-backend
A simple express.js-based backend that hosts PDF-files for exam review.

## Prerequisites
* Node.js runtime (preferably v24)
* a MongoDB Server (>= v6.0)
* an OpenID-connect capable identity provider

### installing dependencies

``` shell
npm install
```

### building the backend

As the backend is written in TypeScript, it must be transpiled to JavaScript before execution:

```shell
npm run build
```

The build output is located in the subdirectory `dist\`. Running the backend with given start script (see next section) uses this directory.

## Running the backend

After transpilation, the backend can be started with the following command. Make sure to set all the [environment variables](#configuration-environment-variables) that are needed.

``` shell
npm run start
```

### Configuration (environment variables)

| variable name                | default value / mandatory / optional | description                                                         |
|------------------------------|--------------------------------------|---------------------------------------------------------------------|
| `SERVER_PORT`                | `3000`                               |                                                                     |
| `ALLOWED_ORIGIN`             | `http://localhost:4200`              | allowed CORS origin                                                 |
| `JWT_ISSUER`                 | (mandatory)                          | expected issuer of the JWT (will be matched with the iss field)     |
| `JWT_SECRET`                 | (mandatory)                          | public key for JWT verification                                     |
| `JWT_LECTURER_ROLE`          | `lecturer`                           | role that must be present in the JWT to identify a teacher/lecturer |
| `JWT_STUDENT_ROLE`           | `student`                            | role that must be present in the JWT to identify a student          |
| `JWT_EMAIL_ATTRIBUTE`        | `email`                              | name of the email attribute in the JWT                              |
| `JWT_STUDENT_ID_ATTRIBUTE`   | `student_id`                         | name of the student-ID (Matrikelnummer) attribute in the JWT        |
| `JWT_FIRSTNAME`              | `given_name`                         | name of the given name (first name) attribute in the JWT            |
| `JWT_LASTNAME`               | `last_name`                          | name of the family name (last name) attribute in the JWT            |
| `MONGODB_USERNAME`           | (optional)                           |                                                                     |
| `MONGODB_PASSWORD`           | (optional)                           |                                                                     |
| `MONGODB_HOST`               | `localhost`                          |                                                                     |
| `MONGODB_PORT`               | `27017`                              |                                                                     |
| `MONGODB_DATABASE_NAME`      | `e2xExamReview`                      | name of the MongoDB database                                        |
| `MAX_FILES_PER_ANSWER_SHEET` | `64`                                 | limits how many PDF-documents per student can be linked to an exam  |
