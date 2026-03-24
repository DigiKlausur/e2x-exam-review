import {Request, Response} from "express";
import {User} from "../models/User";
import {Exam} from "../models/Exam";
import {writeFile, mkdir, rm} from "node:fs/promises";
import {ObjectId} from "mongodb";
import {AnswerSheet} from "../models/AnswerSheet";
import {Student} from "../models/Student";
import {IAnswerSheet, IExam, IUser} from "../interfaces";
import {Request as JwtRequest} from 'express-jwt';
import {getCurrentUser, getUserFromJwt} from "../util/user";

export async function getExamsByExaminer(req: Request, res: Response) {
    const currentUser: IUser | null | undefined = await getCurrentUser(req);
    if(!currentUser) {
        return res.status(400).send({error: 'Unable to find current user!'});
    }
    res.send(await Exam.find({$or: [
            {"primaryExaminer": {_id: currentUser._id?.toString()}},
            {"secondaryExaminer": {_id: currentUser._id?.toString()}},
            {"owner": {_id: currentUser._id?.toString()}},
        ]}).lean().sort([['semester.year', -1], ['semester.season', -1], ['title', 1]]).populate(['primaryExaminer', 'secondaryExaminer']));
}

export async function getExamById(req: Request, res: Response) {
    const currentUser: IUser | null | undefined = await getCurrentUser(req);
    if(!currentUser) {
        return res.status(400).send({error: 'Unable to find current user!'});
    }

    res.send(await Exam.findOne({$and: [
            {_id: req.params.id as string},
            {$or: [
                {"primaryExaminer": {_id: currentUser._id?.toString()}},
                {"secondaryExaminer": {_id: currentUser._id?.toString()}},
                {"owner": {_id: currentUser._id?.toString()}},
            ]}
        ]}).lean().populate(['primaryExaminer', 'secondaryExaminer']));
}

export async function createExam(req: Request, res: Response) {
    req.body.owner = await User.findOne().lean();
    res.send(await Exam.insertOne(req.body));
}

export async function updateExam(req: Request, res: Response) {
    const currentUser: IUser | null | undefined = await getCurrentUser(req);
    if(!currentUser) {
        return res.status(400).send({error: 'Unable to find current user!'});
    }

    res.send(
        await Exam.updateOne({
            // @ts-ignore
            _id: req.body._id as string,
            $or: [
                {"primaryExaminer": currentUser._id!.toString()},
                {"secondaryExaminer": currentUser._id!.toString()},
                {"owner": currentUser._id!.toString()},
            ]
        }, {$set: req.body}));
}

export async function getAnswerSheetsByExamId(req: Request, res: Response) {
    const currentUser: IUser | null | undefined = await getCurrentUser(req);
    if(!currentUser) {
        return res.status(400).send({error: 'Unable to find current user!'});
    }

    return res.send(
        [...
        await AnswerSheet.find(
            // @ts-ignore
            {'exam': new ObjectId(req.params.id as string)}
        ).populate(['submitter', {path: 'exam', populate: ['primaryExaminer', 'secondaryExaminer']}])
        .lean()].filter((answerSheet: IAnswerSheet) =>
            answerSheet.exam.primaryExaminer._id?.toString() === currentUser._id?.toString()
            || answerSheet.exam.secondaryExaminer._id?.toString() === currentUser._id?.toString()
            || answerSheet.exam.owner._id?.toString() === currentUser._id?.toString()
        ).sort((answerSheetA, answerSheetB) => answerSheetA.submitter.studentId - answerSheetB.submitter.studentId)
    );
}

export async function addAnswerSheet(req: Request, res: Response) {
    const currentUser: IUser | null | undefined = await getCurrentUser(req);
    if(!currentUser) {
        return res.status(400).send({error: 'Unable to find current user!'});
    }

    const exam: IExam | null | undefined = await Exam.findOne({$and: [
            {_id: req.params.id as string},
            {$or: [
                    {"primaryExaminer": {_id: currentUser._id as string}},
                    {"secondaryExaminer": {_id: currentUser._id as string}},
                    {"owner": {_id: currentUser._id as string}},
                ]}
    ]});

    if(!exam) {
        return res.status(400).send({error: 'Exam not found'});
    }
    if (!req.file){
        return res.status(400).send({error: 'File not found'});
    }

    let submitter = await Student.findOne({studentId: req.body.studentId});
    if(!submitter) {
        submitter = new Student({
            studentId: req.body.studentId,
        });
    }

    const fileId = new ObjectId();
    const directoryPath: string =`answer-sheets/${exam._id}`;
    await mkdir(directoryPath, { recursive: true });
    const filePath: string = `${directoryPath}/${fileId}.pdf`;
    await submitter.save();
    await new AnswerSheet({
            exam: exam,
            submitter: submitter,
            filePath: filePath,
            originalFileName: req.body.originalFileName
        })
        .save()
        .then(async (answerSheet: IAnswerSheet) => {
            await writeFile(filePath, req.file!.buffer, {})
            res.send(answerSheet);
        })
        .catch((err) => {
            if (err.code === 11000){
                res.status(400).send({error: 'duplicate answer sheet'});
            }else{
                res.status(500).send({error: err.message});
            }
        })
}

export async function deleteAnswerSheet(req: Request, res: Response) {
    const currentUser: IUser | null | undefined = await getCurrentUser(req);
    if(!currentUser) {
        return res.status(400).send({error: 'Unable to find current user!'});
    }
    await AnswerSheet.findOne({$and: [
            {_id: req.params.id as string},
            {$or: [
                {"exam.primaryExaminer": {_id: currentUser._id as string}},
                {"exam.secondaryExaminer": {_id: currentUser._id as string}},
                {"exam.owner": {_id: currentUser._id as string}},
            ]}
        ]})
        .then(async (answerSheet: IAnswerSheet | undefined | null) => {
            if(!answerSheet) {throw Error('answer sheet not found');}
            await AnswerSheet.deleteOne({_id: answerSheet._id as string});
            await rm(answerSheet.filePath);
            res.send();
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
        ]}).sort([['lastname', 1], ['firstname', 1]]));
}

export async function updateUser(req: JwtRequest, res: Response) {
    const currentUserData: IUser | undefined = getUserFromJwt(req) as IUser | undefined;
    if(!currentUserData) {
        return res.status(400).send({error: 'Unable to extract user-data from token!'});
    }
    await User.findOneAndUpdate({email: currentUserData.email}, currentUserData, {upsert: true}).lean()
        .then((updatedUser: IUser|null) => {
            res.send(updatedUser);
        })
}


