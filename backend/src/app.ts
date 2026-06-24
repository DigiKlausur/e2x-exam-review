import * as express from "express";
import {Application} from "express";
import {applyReviewRoutes} from "./routes/reviewApi";
import * as cors from 'cors';
import {answerSheetProtection} from "./middlewares/answerSheetProtection";
import {connect} from 'mongoose';
import {applyManagementRoutes} from "./routes/managementApi";
import {expressjwt} from "express-jwt";
import {config} from "./globals";
import {Request} from "express";
import {Jwt} from 'jsonwebtoken';
import * as jwkToPem from 'jwk-to-pem';

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


let jwtSecrets: string | Record<number, string>, jwtIssuer: string;

async function ensureJwtIsConfigured(): Promise<void> {

    if (config.jwt.openIdConfigUrl) { //if the openID config URL is configured try to autoconfigure
        try {
            const openIdConfig = await (await fetch(config.jwt.openIdConfigUrl)).json();
            jwtIssuer = openIdConfig.issuer;
            jwtSecrets = Object.fromEntries((await (await fetch(openIdConfig['jwks_uri'])).json()).keys.map((jwk: jwkToPem.JWK & {kid: string}) => [jwk.kid, jwkToPem(jwk)]));
            if(Object.keys(jwtSecrets).length < 1) throw new Error('no keys found');
        }catch (e){ //otherwise use secret & issuer from the config
            console.error("Failed to fetch OpenID configuration!");
            console.error(e);
            process.exit(1);
        }
    } else {
        if (!config.jwt.secret || !config.jwt.issuer) {
            console.error("JWT secret and issuer must be configured!");
            process.exit(1);
        }

        jwtSecrets = "-----BEGIN PUBLIC KEY-----\r\n" + config.jwt.secret + "\r\n-----END PUBLIC KEY-----";
        jwtIssuer = config.jwt.issuer;
    }
}

const getSecret =  (req: Request, token?: Jwt): string | undefined => {
    if(!token) return undefined;
    if(typeof jwtSecrets === 'string') return jwtSecrets as string;
    return (jwtSecrets as Record<any, any>)[token.header.kid as string];
}

ensureJwtIsConfigured()
    .then(() => {
        const jwtMiddleware = expressjwt({
            secret: getSecret,
            algorithms: ["RS256"],
            issuer: jwtIssuer!,
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
    });
