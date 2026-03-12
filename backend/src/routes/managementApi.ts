import {Router} from "express";
import {getExamById, getExamsByExaminer} from "../controllers/managementController";

export function applyManagementRoutes(parentRouter: Router) {
    const managementRouter = Router();

    managementRouter.get('/exams', getExamsByExaminer);
    managementRouter.get('/exams/:id', getExamById);

    parentRouter.use('/manage', managementRouter);
}
