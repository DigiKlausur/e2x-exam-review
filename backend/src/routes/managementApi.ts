import {Router} from 'express';
import * as multer from 'multer';
import {
    addAnswerSheet,
    createExam, deleteAnswerSheet, getAnswerSheetsByExamId,
    getExamById,
    getExamsByExaminer,
    searchUsers,
    updateExam
} from "../controllers/managementController";
import {jwtProtect} from "../middlewares/jwtProtect";
import {config} from "../globals";

export function applyManagementRoutes(parentRouter: Router) {
    const managementRouter = Router();

    managementRouter.use(jwtProtect(config.jwt.roleMappings.lecturer));
    managementRouter.get('/exams', getExamsByExaminer);
    managementRouter.get('/exams/:id', getExamById);
    managementRouter.put('/exams', updateExam);
    managementRouter.post('/exams', createExam);

    managementRouter.get('/exams/:id/answerSheet', getAnswerSheetsByExamId);
    managementRouter.post('/exams/:id/answerSheet', multer().single('file'), addAnswerSheet);
    managementRouter.delete('/answerSheet/:id', deleteAnswerSheet);

    managementRouter.get('/users/search', searchUsers);

    parentRouter.use('/manage', managementRouter);
}
