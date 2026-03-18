import {Router} from "express";
import {getAnswerSheetById, getAnswerSheets} from "../controllers/reviewController";
import {jwtProtect} from "../middlewares/jwtProtect";
import {config} from "../globals";

export function applyReviewRoutes(parentRouter: Router) {
    const reviewRouter = Router();

    reviewRouter.use(jwtProtect([config.jwt.roleMappings.student, config.jwt.roleMappings.lecturer]));
    reviewRouter.get('/answer-sheets', getAnswerSheets);
    reviewRouter.get('/answer-sheets/:id', getAnswerSheetById);

    parentRouter.use('/review', reviewRouter);
}
