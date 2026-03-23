import {Router} from "express";
import {getAnswerSheetById, getAnswerSheets, updateStudent} from "../controllers/reviewController";
import {jwtProtect} from "../middlewares/jwtProtect";
import {config} from "../globals";
import {addAnswerSheet} from "../controllers/managementController";

export function applyReviewRoutes(parentRouter: Router) {
    const reviewRouter = Router();

    reviewRouter.get('/answer-sheets', jwtProtect(config.jwt.roleMappings.student), getAnswerSheets);
    reviewRouter.get('/answer-sheets/:id', jwtProtect([config.jwt.roleMappings.student, config.jwt.roleMappings.lecturer]), getAnswerSheetById);

    reviewRouter.post('/students', jwtProtect(config.jwt.roleMappings.student), updateStudent);

    parentRouter.use('/review', reviewRouter);
}
