import * as express from "express";
import {Application} from "express";
import {applyReviewRoutes} from "./routes/reviewApi";
import * as cors from 'cors';
import {answerSheetProtection} from "./middlewares/answerSheetProtection";
import {connect} from 'mongoose';
import {applyManagementRoutes} from "./routes/managementApi";
import {expressjwt} from "express-jwt";
import {config} from "./globals";

export const ANSWER_SHEETS_PATH = "answer-sheets";

const app: Application = express();
app.use(express.json());
app.use(cors({
    origin: config.corsOrigin,
    credentials: true
}));
const apiRouter = express.Router();

applyReviewRoutes(apiRouter);
applyManagementRoutes(apiRouter);

if(!config.jwt.secret || !config.jwt.issuer) {
    console.error("JWT secret and issuer must be configured!");
    process.exit(1);
}

const jwtMiddleware = expressjwt({
    secret: "-----BEGIN PUBLIC KEY-----\r\n" + config.jwt.secret + "\r\n-----END PUBLIC KEY-----",
    algorithms: ["RS256"],
    issuer: config.jwt.issuer,
});

app.use('/api/v1', jwtMiddleware, apiRouter);
app.use('/' + ANSWER_SHEETS_PATH, jwtMiddleware, answerSheetProtection, express.static(config.fileStorageLocation, {index: false}));

const authString = config.mongoDb.username ?  config.mongoDb.username + (config.mongoDb.password ? ':' + config.mongoDb.password : '') + '@' : '';

const db = connect(`mongodb://${authString}${config.mongoDb.host}:${config.mongoDb.port}/${config.mongoDb.database}`);

db.then(async () => {
    app.listen(config.serverPort, () => {
        console.log(`Server started http://localhost:${config.serverPort}`);
    });
});

