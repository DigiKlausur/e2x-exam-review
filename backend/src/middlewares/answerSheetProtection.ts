import {Response, NextFunction} from "express";
import {Request as JwtRequest} from "express-jwt";
import {AnswerSheet} from "../models/AnswerSheet";
import {hasRole} from "./jwtProtect";
import {config} from "../globals";
import {getCurrentUser} from "../util/user";

export const answerSheetProtection = async (req: JwtRequest, res: Response, next: NextFunction) => {
    const answerSheet = await AnswerSheet.findOne({'files.filePath': 'answer-sheets' + req.path}).populate([{path: 'exam', populate: ['primaryExaminer', 'secondaryExaminer']}, 'submitter']).lean();
    if(!answerSheet) return res.status(400).send('No such answer sheet');
    if(hasRole(req, config.jwt.roleMappings.lecturer)){
        if(!req.auth?.[config.jwt.attributeMappings.email]) return res.status(400).send('Email not present in JWT');

        const currentUser = await getCurrentUser(req);
        if(!currentUser) return res.status(400).send('Unable to identify current user');

        if(answerSheet.exam.owner._id?.toString() === currentUser._id?.toString() || answerSheet.exam.primaryExaminer._id?.toString() === currentUser._id?.toString() || answerSheet.exam.secondaryExaminer?._id?.toString() === currentUser._id?.toString()){
            return next();
        }
    }else if(hasRole(req, config.jwt.roleMappings.student)){
        if(!req.auth?.[config.jwt.attributeMappings.studentId]) return res.status(400).send('Student ID not present in JWT');
        if(answerSheet.submitter.studentId.toString() === req.auth[config.jwt.attributeMappings.studentId]) return next();
    }
    res.status(403).send('forbidden');
};
