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
import {body, param, query} from "express-validator";
import {enforceValidity} from "../middlewares/requestValidation";

export function applyManagementRoutes(parentRouter: Router) {
    const managementRouter = Router();

    managementRouter.use(jwtProtect(config.jwt.roleMappings.lecturer));
    managementRouter.get('/exams', getExamsByExaminer);
    managementRouter.get(
        '/exams/:id',
        param('id').isMongoId(),
        enforceValidity,
        getExamById
    );
    managementRouter.put(
        '/exams',
        body('_id').isMongoId(),
        body('title').isString().isLength({min: 2, max: 512}),
        body('semester.year').isNumeric(),
        body('semester.season').isIn(['summer', 'winter']),
        body('primaryExaminer._id').isMongoId(),
        body('secondaryExaminer._id').optional().isMongoId(),
        body('date').isISO8601(),
        body('reviewParameters.startDate').optional({nullable: true}).isISO8601(),
        body('reviewParameters.endDate').optional({nullable: true}).isISO8601(),
        body('reviewParameters.showDownloadButton').isBoolean(),
        body('reviewParameters.showTextLayer').isBoolean(),
        enforceValidity,
        updateExam
    );
    managementRouter.post(
        '/exams',
        body('title').isString().isLength({min: 2, max: 512}),
        body('semester.year').isNumeric(),
        body('semester.season').isIn(['summer', 'winter']),
        body('primaryExaminer._id').isMongoId(),
        body('secondaryExaminer._id').optional().isMongoId(),
        body('date').isISO8601(),
        body('reviewParameters.startDate').optional({nullable: true}).isISO8601(),
        body('reviewParameters.endDate').optional({nullable: true}).isISO8601(),
        body('reviewParameters.showDownloadButton').isBoolean(),
        body('reviewParameters.showTextLayer').isBoolean(),
        enforceValidity,
        createExam
    );

    managementRouter.get(
        '/exams/:id/answer-sheets',
        param('id').isMongoId(),
        enforceValidity,
        getAnswerSheetsByExamId
    );

    managementRouter.post(
        '/exams/:id/answer-sheets',
        multer().array('files', config.limits.maxFilesPerAnswerSheet as number),
        param('id').isMongoId(),
        body('studentId').isNumeric(),
        enforceValidity,
        addAnswerSheet
    );

    managementRouter.delete(
        '/answer-sheets/:id',
        param('id').isMongoId(),
        enforceValidity,
        deleteAnswerSheet
    );

    managementRouter.post(
        '/users',
        updateUser
    );

    managementRouter.get(
        '/users/search',
        query('query').isString().isLength({min: 0, max: 64}),
        enforceValidity,
        searchUsers
    );

    parentRouter.use('/manage', managementRouter);
}
