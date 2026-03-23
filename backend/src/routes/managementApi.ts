import {Router} from 'express';
import * as multer from 'multer';
import {
    addAnswerSheet,
    createExam, deleteAnswerSheet, getAnswerSheetsByExamId,
    getExamById,
    getExamsByExaminer,
    searchUsers,
    updateExam, updateUser
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

    managementRouter.get('/exams/:id/answer-sheets', getAnswerSheetsByExamId);
    managementRouter.post('/exams/:id/answer-sheets', multer().single('file'), addAnswerSheet);
    managementRouter.delete('/answer-sheets/:id', deleteAnswerSheet);

    managementRouter.post('/users', updateUser);
    managementRouter.get('/users/search', searchUsers);

    parentRouter.use('/manage', managementRouter);
}
