import {Router} from "express";
import {getAnswerSheets} from "../controllers/reviewController";

export function applyReviewRoutes(parentRouter: Router) {
    const reviewRouter = Router();

    reviewRouter.get('/answer-sheets', getAnswerSheets);

    parentRouter.use('/review', reviewRouter);
}
