import {Request, Response} from "express";
import {User} from "../models/User";
import {Exam} from "../models/Exam";
import {writeFile} from "node:fs/promises";
import {ObjectId} from "mongodb";
import {AnswerSheet} from "../models/AnswerSheet";
import {Student} from "../models/Student";

export async function getExamsByExaminer(req: Request, res: Response) {
    const userId = (await User.findOne().lean())!._id;
    res.send(await Exam.find({$or: [{primaryExaminer: {_id: userId}}, {secondaryExaminer: {_id: userId}}]}).lean().populate(['primaryExaminer', 'secondaryExaminer']));
}

export async function getExamById(req: Request, res: Response) {
    res.send(await Exam.findById(req.params.id).lean().populate(['primaryExaminer', 'secondaryExaminer']));
}

export async function createExam(req: Request, res: Response) {
    req.body.owner = await User.findOne().lean();
    res.send(await Exam.insertOne(req.body));
}

export async function updateExam(req: Request, res: Response) {
    res.send(await Exam.updateOne({_id: req.body._id}, {$set: req.body}));
}

export async function addAnswerSheet(req: Request, res: Response) {
    const exam = await Exam.findById(req.params.id);
    if(!exam) {
        return res.status(400).send({error: 'Exam not found'});
    }
    if (!req.file){
        return res.status(400).send({error: 'File not found'});
    }

    req.body.submitter = await Student.findOne({studentId: req.body.submitter.studentId});
    if(!req.body.submitter) {
        req.body.submitter = new Student({
            studentId: req.body.submitter.studentId,
        }).save();
    }

    req.body._id = new ObjectId();
    const filePath = `answer-sheets/${exam._id}/${req.body._id}.pdf`
    await writeFile(filePath, req.file?.buffer)
        .then(async () => {
            const answerSheet = await new AnswerSheet(req.body).save();
            res.send(answerSheet);
        });
}

export async function searchUsers(req: Request, res: Response) {
    const queryRegexs: RegExp[] = (req.query.query as string)
        .trim() // remove leading and trailing whitespace
        .split(' ') //split at spaces
        .filter(part => part) //remove empty parts
        .map(str => new RegExp(str, 'i'));
    res.send(await User.find({$or: [
            {firstname: {$in: queryRegexs}},
            {lastname: {$in: queryRegexs}},
            {email: {$in: queryRegexs}}
        ]}));
}
