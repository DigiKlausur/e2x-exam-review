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
    /*
        #swagger.responses[200] = {
            description: 'list of exams, to which the current user is connected (owner or examiner)',
            content: {
                'application/json': {
                    schema: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/exam'
                        }
                    }
                }
            }
        }
     */
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
    /*
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'ID of the exam',
            required: true,
            type: 'string'
        }
        #swagger.responses[200] = {
            description: 'exam',
            content: {
                'application/json': {
                    schema: {
                        $ref: '#/components/schemas/exam'
                    }
                }
            }
        }
     */
    const currentUser: IUser | null | undefined = await getCurrentUser(req);
    if(!currentUser) {
        return res.status(400).send({error: 'Unable to find current user!'});
    }

    await Exam.findOne({$and: [
            {_id: req.params.id as string},
            {$or: [
                    {"primaryExaminer": {_id: currentUser._id?.toString()}},
                    {"secondaryExaminer": {_id: currentUser._id?.toString()}},
                    {"owner": {_id: currentUser._id?.toString()}},
                ]}
        ]})
        .lean()
        .populate(['primaryExaminer', 'secondaryExaminer'])
        .then(exam => {
            if(exam) res.send(exam);
            else res.status(404).send({error: 'Unable to find exam'});
        });
}

export async function createExam(req: Request, res: Response) {
    /*
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            title: {
                                type: 'string',
                                required: true,
                                minLength: 2,
                                maxLength: 512
                            },
                            semester: {
                                required: true,
                                $ref: '#/components/schemas/semester'
                            },
                            primaryExaminer: {
                                type: "object",
                                required: true,
                                properties: {
                                    _id: {
                                        required: true,
                                        $ref: '#/components/schemas/objectId'
                                    }
                                }
                            },
                            secondaryExaminer: {
                                type: "object",
                                required: true,
                                properties: {
                                    _id: {
                                        required: true,
                                        $ref: '#/components/schemas/objectId'
                                    }
                                }
                            },
                            date: {
                                type: 'string',
                                required: true,
                                format: 'date'
                            },
                            reviewParameters: {
                                type: 'object',
                                properties: {
                                    startDate: {
                                        type: 'string',
                                        required: true,
                                        format: 'date',
                                        nullable: true
                                    },
                                    endDate: {
                                        type: 'string',
                                        required: true,
                                        format: 'date',
                                        nullable: true
                                    },
                                    showDownloadButton: {
                                        required: true,
                                        type: 'boolean'
                                    },
                                    showTextLayer: {
                                        required: true,
                                        type: 'boolean'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: 'exam',
            content: {
                'application/json': {
                    schema: {
                        $ref: '#/components/schemas/exam'
                    }
                }
            }
        }
     */
    const currentUser: IUser | null | undefined = await getCurrentUser(req);
    if(!currentUser) {
        return res.status(400).send({error: 'Unable to find current user!'});
    }

    res.send(await Exam.insertOne({
        title: req.body.title,
        semester: {
            year: req.body.semester.year,
            season: req.body.semester.season
        },
        primaryExaminer: req.body.primaryExaminer._id,
        secondaryExaminer: req.body.secondaryExaminer._id,
        date: req.body.date,
        reviewParameters: {
            startDate: req.body.reviewParameters.startDate,
            endDate: req.body.reviewParameters.endDate,
            showDownloadButton: req.body.reviewParameters.showDownloadButton,
            showTextLayer: req.body.reviewParameters.showTextLayer
        },
        owner: currentUser
    }));
}

export async function updateExam(req: Request, res: Response) {
    /*
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            _id: {
                                required: true,
                                $ref: '#/components/schemas/objectId'
                            },
                            title: {
                                type: 'string',
                                required: true,
                                minLength: 2,
                                maxLength: 512
                            },
                            semester: {
                                required: true,
                                $ref: '#/components/schemas/semester'
                            },
                            primaryExaminer: {
                                type: "object",
                                properties: {
                                    _id: {
                                        required: true,
                                        $ref: '#/components/schemas/objectId'
                                    }
                                }
                            },
                            secondaryExaminer: {
                                type: "object",
                                properties: {
                                    _id: {
                                        required: true,
                                        $ref: '#/components/schemas/objectId'
                                    }
                                }
                            },
                            date: {
                                type: 'string',
                                required: true,
                                format: 'date'
                            },
                            reviewParameters: {
                                type: 'object',
                                properties: {
                                    startDate: {
                                        type: 'string',
                                        format: 'date',
                                        required: true,
                                        nullable: true
                                    },
                                    endDate: {
                                        type: 'string',
                                        format: 'date',
                                        required: true,
                                        nullable: true
                                    },
                                    showDownloadButton: {
                                        required: true,
                                        type: 'boolean'
                                    },
                                    showTextLayer: {
                                        required: true,
                                        type: 'boolean'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
     */

    const currentUser: IUser | null | undefined = await getCurrentUser(req);
    if(!currentUser) {
        return res.status(400).send({error: 'Unable to find current user!'});
    }

    res.send(
        await Exam.updateOne(
            {
                // @ts-ignore
                _id: req.body._id as string,
                $or: [
                    {"primaryExaminer": currentUser._id!.toString()},
                    {"secondaryExaminer": currentUser._id!.toString()},
                    {"owner": currentUser._id!.toString()},
                ]
            },
            {$set: {
                title: req.body.title,
                semester: {
                    year: req.body.semester.year,
                    season: req.body.semester.season
                },
                primaryExaminer: req.body.primaryExaminer._id,
                secondaryExaminer: req.body.secondaryExaminer._id,
                date: req.body.date,
                reviewParameters: {
                    startDate: req.body.reviewParameters.startDate,
                    endDate: req.body.reviewParameters.endDate,
                    showDownloadButton: req.body.reviewParameters.showDownloadButton,
                    showTextLayer: req.body.reviewParameters.showTextLayer
                }
            }}
        )
    );
}

export async function getAnswerSheetsByExamId(req: Request, res: Response) {
    /*
        #swagger.parameters['id'] = {
            in: 'path',
            required: true,
            description: 'ID of the answer-sheet',
            type: 'string'
        }
        #swagger.responses[200] = {
            description: 'list of answer-sheets, belonging to the specified exam',
            content: {
                'application/json': {
                    schema: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/answerSheet'
                        }
                    }
                }
            }
        }
     */
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
    /*  #swagger.parameters['id'] = {
            in: 'path',
            description: 'ID of the exam, the answer-sheet belongs to',
            required: true,
            type: 'string',
            pattern: '^[0-9a-fA-F]{24}$'
        }
        #swagger.requestBody = {
            required: true,
            content: {
                "multipart/form-data": {
                    schema: {
                        type: "object",
                        properties: {
                            studentId: {
                                type: "integer",
                                description: "student ID (Matrikelnummer)"
                            },
                            originalFileName: {
                                type: "string",
                                description: "original name of the file, that was uploaded by the user -> better traceability"
                            },
                            file: {
                                type: "string",
                                format: "binary",
                                description: "answer-sheet as a PDF file"
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: 'answer-sheet',
            content: {
                'application/json': {
                    schema: {
                        $ref: '#/components/schemas/answerSheet'
                    }
                }
            }
        }
     */

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
    /*
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'ID of the answer-sheet',
            required: true,
            type: 'string',
            pattern: '^[0-9a-fA-F]{24}$'
        }
     */
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
    /*
        #swagger.parameters['query'] = {
            in: 'query',
            description: 'search query',
            required: true,
            type: 'string',
            minLength: 0,
            maxLength: 64
        }
        #swagger.responses[200] = {
            description: 'list of matching users',
            content: {
                "application/json": {
                    schema: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/user'
                        }
                    }
                }
            }
        }
     */

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
    /*
        #swagger.responses[200] = {
            description: 'user',
            content: {
                'application/json': {
                    schema: {
                        $ref: '#/components/schemas/user'
                    }
                }
            }
        }
     */
    const currentUserData: IUser | undefined = getUserFromJwt(req) as IUser | undefined;
    if(!currentUserData) {
        return res.status(400).send({error: 'Unable to extract user-data from token!'});
    }
    await User.findOneAndUpdate({email: currentUserData.email}, currentUserData, {upsert: true}).lean()
        .then((updatedUser: IUser|null) => {
            res.send(updatedUser);
        })
}


