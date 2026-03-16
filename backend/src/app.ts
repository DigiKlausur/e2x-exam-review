import * as express from "express";
import {Application} from "express";
import {applyReviewRoutes} from "./routes/reviewApi";
import * as cors from 'cors';
import {answerSheetProtection} from "./middlewares/answerSheetProtection";
import {User} from "./models/User";
import {Student} from "./models/Student";
import {Exam} from "./models/Exam";
import {Season} from "./enums";
import {connect} from 'mongoose';
import {AnswerSheet} from "./models/AnswerSheet";
import {applyManagementRoutes} from "./routes/managementApi";

const SERVER_PORT = process.env.SERVER_PORT ?? "3000";

const app: Application = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:4200',
}));
const apiRouter = express.Router();

applyReviewRoutes(apiRouter);
applyManagementRoutes(apiRouter);

app.use('/api/v1', apiRouter);
app.use('/', express.static('../frontend/dist/e2xgrader-review-frontend/browser'));
app.use('/answer-sheets', answerSheetProtection, express.static('./answer-sheets', {index: false}));

const dbUser = process.env.DB_USERNAME;
const dbPass = process.env.DB_PASSWORD;

const authString = dbUser ?  dbUser + (dbPass ? ':' + dbPass : '') + '@' : '';

const db = connect(`mongodb://${authString}${process.env.DB_HOST ?? 'localhost'}:${process.env.DB_PORT ?? '16510'}/${process.env.DB_NAME ?? 'e2xExamReview'}`);

db.then(async () => {
    /*await Promise.all([
        AnswerSheet.collection.drop(),
        Exam.collection.drop(),
        Student.collection.drop(),
        User.collection.drop()
    ]);

    const user0 = new User({
        email: 'john.doe@h-brs.de',
        firstname: 'John',
        lastname: 'Doe'
    });

    const user1 = new User({
        email: 'jane.smith@h-brs.de',
        firstname: 'Jane',
        lastname: 'Smith'
    });

    const student0 = new Student({
        email: 'max.mustermann@smail.inf.h-brs.de',
        firstname: 'Max',
        lastname: 'Mustermann',
        studentId: 123456789
    });

    await Promise.all([
        user0.save(),
        user1.save(),
        student0.save()
    ]);

    const exam0 = new Exam({
        semester: {
            season: Season.SUMMER,
            year: 2024
        },
        title: 'Einführung in die Wahrscheinlichkeitstheorie und Statistik',
        primaryExaminer: user0,
        secondaryExaminer: user1,
        date: new Date('2024-06-24'),
        reviewParameters: {
            startDate: null,
            endDate: null,
            showDownloadButton: false,
            showTextLayer: true
        },
        owner: user0
    });

    const exam1 = new Exam({
        semester: {
            season: Season.SUMMER,
            year: 2025
        },
        title: 'Einführung in die Wahrscheinlichkeitstheorie und Statistik',
        primaryExaminer: user0,
        secondaryExaminer: user1,
        date: new Date('2025-06-21'),
        reviewParameters: {
            startDate: null,
            endDate: null,
            showDownloadButton: true,
            showTextLayer: true
        },
        owner: user0
    });

    await Promise.all([
        exam0.save(),
        exam1.save()
    ]);

    await AnswerSheet.insertMany([
        {
            exam: exam0,
            submitter: student0,
            filePath: 'answer-sheets/sample.pdf'
        },
        {
            exam: exam1,
            submitter: student0,
            filePath: 'answer-sheets/sample-local-pdf.pdf'
        }
    ]);*/

    app.listen(SERVER_PORT, () => {
        console.log(`Server started http://localhost:${SERVER_PORT}`);
    });
});

