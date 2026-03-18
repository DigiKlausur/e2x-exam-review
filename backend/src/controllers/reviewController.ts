import {Request, Response} from 'express';
import {Request as JwtRequest} from 'express-jwt';
import {AnswerSheet} from "../models/AnswerSheet";
import {hasRole} from "../middlewares/jwtProtect";
import {config} from "../globals";
import {findCurrentStudent} from "../util/student";

export async function getAnswerSheets(req: JwtRequest, res: Response) {
    if(hasRole(req, config.jwt.roleMappings.student)){
        const student = await findCurrentStudent(req, res);
        if(!student) return;
        return res.send(await AnswerSheet.find({submitter: student}).populate({path: 'exam', populate: ['primaryExaminer','secondaryExaminer']}));
    }
    return res.send(await AnswerSheet.find().lean().populate({path: 'exam', populate: ['primaryExaminer','secondaryExaminer']}));
}

export async function getAnswerSheetById(req: Request, res: Response) {
    res.send(await AnswerSheet.findById(req.params.id).lean().populate('exam'));
}
