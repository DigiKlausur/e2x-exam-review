import {Router} from "express";
import {getAnswerSheetById, getAnswerSheets} from "../controllers/reviewController";

export function applyReviewRoutes(parentRouter: Router) {
    const reviewRouter = Router();

    reviewRouter.get('/answer-sheets', getAnswerSheets);
    reviewRouter.get('/answer-sheets/:id', getAnswerSheetById);

    parentRouter.use('/review', reviewRouter);
}
