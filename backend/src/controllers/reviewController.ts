import {Request, Response} from 'express';
import {AnswerSheet} from "../models/AnswerSheet";

export async function getAnswerSheets(req: Request, res: Response) {
    res.send(await AnswerSheet.find().lean().populate({path: 'exam', populate: ['primaryExaminer','secondaryExaminer']}));
}

export async function getAnswerSheetById(req: Request, res: Response) {
    res.send(await AnswerSheet.findById(req.params.id).lean().populate('exam'));
}
