import {Response, NextFunction} from "express";
import {Request as JwtRequest} from "express-jwt";
import {AnswerSheet} from "../models/AnswerSheet";
import {hasRole} from "./jwtProtect";
import {config} from "../globals";
import {User} from "../models/User";

export const answerSheetProtection = async (req: JwtRequest, res: Response, next: NextFunction) => {
    const answerSheet = await AnswerSheet.findOne({filePath: 'answer-sheets' + req.path}).populate([{path: 'exam', populate: ['primaryExaminer', 'secondaryExaminer']}, 'submitter']).lean();
    if(!answerSheet) return res.status(400).send('No such answer sheet');
    if(hasRole(req, config.jwt.roleMappings.lecturer)){
        if(!req.auth?.[config.jwt.attributeMappings.email]) return res.status(400).send('Email not present in JWT');

        const currentUser = await User.findOne({email: req.auth[config.jwt.attributeMappings.email]}).lean();
        if(!currentUser) return res.status(400).send('Unable to identify current user');

        if(answerSheet.exam.owner._id === currentUser._id || answerSheet.exam.primaryExaminer._id === currentUser._id || answerSheet.exam.secondaryExaminer._id === currentUser._id){
            return next();
        }
    }else if(hasRole(req, config.jwt.roleMappings.student)){
        if(!req.auth?.[config.jwt.attributeMappings.studentId]) return res.status(400).send('Student ID not present in JWT');
        if(answerSheet.submitter.studentId.toString() === req.auth[config.jwt.attributeMappings.studentId]) return next();
    }
    res.status(403).send('forbidden');
};
