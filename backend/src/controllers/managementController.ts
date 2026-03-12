import {Request, Response} from "express";
import {User} from "../models/User";
import {Exam} from "../models/Exam";

export async function getExamsByExaminer(req: Request, res: Response) {
    const userId = (await User.findOne().lean())!._id;
    res.send(await Exam.find({$or: [{primaryExaminer: {_id: userId}}, {secondaryExaminer: {_id: userId}}]}).lean().populate(['primaryExaminer', 'secondaryExaminer']));
}

export async function getExamById(req: Request, res: Response) {
    res.send(await Exam.findById(req.params.id).lean().populate(['primaryExaminer', 'secondaryExaminer']));
}
