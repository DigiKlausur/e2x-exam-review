import * as express from "express";
import {Application} from "express";
import {applyReviewRoutes} from "./routes/reviewApi";
import * as cors from 'cors';

const SERVER_PORT = process.env.SERVER_PORT ?? "3000";

const app: Application = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:4200',
}));
const apiRouter = express.Router();

applyReviewRoutes(apiRouter);

app.use('/api/v1', apiRouter);
app.use('/', express.static('../frontend/dist/e2xgrader-review-frontend/browser'));
app.use('/answer-sheets', express.static('./answer-sheets', {index: false}));

app.listen(SERVER_PORT, () => {
    console.log(`Server started http://localhost:${SERVER_PORT}`);
})
