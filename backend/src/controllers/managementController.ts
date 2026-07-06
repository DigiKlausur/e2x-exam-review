import {Request, Response} from "express";
import {User} from "../models/User";
import {Exam} from "../models/Exam";
import {promises as fs} from "fs";
import {AnswerSheet} from "../models/AnswerSheet";
import {Student} from "../models/Student";
import {IAnswerSheetBase, IAnswerSheetPopulated} from "../interfaces/IAnswerSheet";
import {IExamBase} from "../interfaces/IExam";
import {IFileBase} from "../interfaces/IFile";
import {IUserBase} from "../interfaces/IUser";
import {Request as JwtRequest} from 'express-jwt';
import {getCurrentUser, getUserFromJwt} from "../util/user";
import * as path from 'path';
import {config} from "../globals";
import {ANSWER_SHEETS_PATH} from "../app";
import {ObjectId} from "mongodb";
import {QueryFilter, Document} from "mongoose";

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
    const currentUser: IUserBase | null | undefined = await getCurrentUser<IUserBase>(req);
    if(!currentUser) {
        return res.status(400).send({error: 'Unable to find current user!'});
    }

    res.send(await Exam.find<IExamBase>(Private.buildAccessFilter(currentUser)).lean().sort([['semester.year', -1], ['semester.season', -1], ['title', 1]]).populate(['primaryExaminer', 'secondaryExaminer']).exec());
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
    const currentUser: IUserBase | null | undefined = await getCurrentUser<IUserBase>(req);
    if(!currentUser) {
        return res.status(400).send({error: 'Unable to find current user!'});
    }

    await Exam.findOne<IExamBase>({$and: [
            {_id: new ObjectId(req.params.id as string)},
            Private.buildAccessFilter(currentUser)
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
                                properties: {
                                    _id: {
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
    const currentUser: IUserBase | null | undefined = await getCurrentUser<IUserBase>(req);
    if(!currentUser) {
        return res.status(400).send({error: 'Unable to find current user!'});
    }

    const newExam = new Exam({
        title: req.body.title,
        semester: {
            year: req.body.semester.year,
            season: req.body.semester.season
        },
        primaryExaminer: req.body.primaryExaminer._id,
        secondaryExaminer: req.body.secondaryExaminer?._id ?? undefined,
        date: req.body.date,
        reviewParameters: {
            startDate: req.body.reviewParameters.startDate,
            endDate: req.body.reviewParameters.endDate,
            showDownloadButton: req.body.reviewParameters.showDownloadButton,
            showTextLayer: req.body.reviewParameters.showTextLayer
        },
        owner: currentUser._id!
    })

    res.send(await newExam.save());
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
                                properties: {
                                    _id: {
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
                                        required: true
                                    },
                                    endDate: {
                                        type: 'string',
                                        format: 'date',
                                        required: true
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

  const currentUser: IUserBase | null | undefined = await getCurrentUser<IUserBase>(req);
  if (!currentUser) {
    return res.status(400).send({ error: "Unable to find current user!" });
  }

  res.send(
    await Exam.updateOne(
      {
        $and: [
          {_id: req.body._id as string},
          Private.buildAccessFilter(currentUser)
        ]
      },
      {
        $set: {
          title: req.body.title,
          semester: {
            year: req.body.semester.year,
            season: req.body.semester.season,
          },
          primaryExaminer: req.body.primaryExaminer._id,
          secondaryExaminer: req.body.secondaryExaminer?._id ?? undefined,
          date: req.body.date,
          reviewParameters: {
            startDate: req.body.reviewParameters.startDate,
            endDate: req.body.reviewParameters.endDate,
            showDownloadButton: req.body.reviewParameters.showDownloadButton,
            showTextLayer: req.body.reviewParameters.showTextLayer,
          },
        },
        $unset: !req.body.secondaryExaminer ? { secondaryExaminer: 1 } : {},
      },
    ),
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
    const currentUser: IUserBase | null | undefined = await getCurrentUser<IUserBase>(req);
    if(!currentUser) {
        return res.status(400).send({error: 'Unable to find current user!'});
    }

    return res.send(
        [...
        await AnswerSheet.find<IAnswerSheetBase>(
            {'exam': new ObjectId(req.params.id as string)}
        ).populate(['submitter', {path: 'exam', populate: ['primaryExaminer', 'secondaryExaminer']}])
        .lean<IAnswerSheetPopulated[]>()].filter((answerSheet: IAnswerSheetPopulated) =>
            answerSheet.exam.primaryExaminer._id?.toString() === currentUser._id?.toString()
            || answerSheet.exam.secondaryExaminer?._id?.toString() === currentUser._id?.toString()
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
                                required: true,
                                description: "student ID (Matrikelnummer)"
                            },
                            files: {
                                type: "array",
                                required: true,
                                items: {
                                  type: "string",
                                  format: "binary",
                                  description: "answer-sheet as a PDF file"
                                }
                            },
                            fileOverwrite: {
                                type: "string",
                                required: true
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

  const currentUser: IUserBase | null | undefined = await getCurrentUser<IUserBase>(req);
  if (!currentUser) {
    return res.status(400).send({ error: "Unable to find current user!" });
  }

  if (!req.files) {
    return res.status(400).send({ error: "No files present!" });
  }

  const exam = await Exam.findOne({
    $and: [
      { _id: req.params.id as string },
      Private.buildAccessFilter(currentUser),
    ],
  });

  if (!exam) {
    return res.status(400).send({ error: "Exam not found" });
  }

  let submitter = await Student.findOne({ studentId: req.body.studentId });
  if (!submitter) {
    submitter = new Student({
      studentId: req.body.studentId,
    });
  }

  const directoryPath: string = path.join(config.fileStorageLocation, exam._id!.toString());
  await fs.mkdir(directoryPath, { recursive: true });

  const newFiles: (Omit<IFileBase, "_id"> & { _id: ObjectId })[] = (
    req.files as Express.Multer.File[]
  ).map((file: Express.Multer.File) => {
    const fileId = new ObjectId();
    return {
      _id: fileId,
      sysFilePath: path.join(directoryPath,`${fileId}.pdf`),
      filePath: `${ANSWER_SHEETS_PATH}/${exam._id!.toString()}/${fileId}.pdf`,
      originalFileName: file.originalname,
    };
  });

  const existingAnswerSheet: IAnswerSheetBase & {_id: string} | null = await AnswerSheet.findOne<IAnswerSheetBase & {_id: string}>({
      exam: exam._id.toString(),
      submitter: submitter._id.toString()
  }).lean<IAnswerSheetBase & {_id: string}>().exec();

  const newFileNames: string[] = newFiles.map(file => file.originalFileName);
  const fileNameIntersection = existingAnswerSheet?.files.filter((f: IFileBase) => newFileNames.includes(f.originalFileName)) ?? [];
  console.log(fileNameIntersection);
  if(existingAnswerSheet && fileNameIntersection.length > 0) {
      if (req.body.fileOverwrite === 'true'){
          await Promise.all(fileNameIntersection.map(async (file) => {
              console.log(existingAnswerSheet, file);
              await AnswerSheet.updateOne({_id: existingAnswerSheet._id}, {$pull: {files: {_id: file._id}}});
              await fs.rm(file.sysFilePath);
          }))
      } else {
          return res.status(400).send({error: "Unable to assign multiple files with the same name to one answer sheet!"});
      }
  }

  await submitter.save();
  await AnswerSheet.findOneAndUpdate(
  {
      exam: exam._id.toString(),
      submitter: submitter._id.toString()
  },
  {
    exam: exam,
    submitter: submitter,
    $push: {files: {$each: newFiles}}
  },
  {upsert: true}).lean()
    .then(async (answerSheet: IAnswerSheetBase | null) => {
      await Promise.all(
        newFiles.map(
          async (file: Omit<IFileBase, "_id"> & { _id: ObjectId }, index: number) =>
            fs.writeFile(
              file.sysFilePath,
              (req.files as Express.Multer.File[])[index]!.buffer,
              {},
            ),
        ),
      );
      res.send(answerSheet);
    })
    .catch((err) => {
      if (err.code === 11000) {
        res.status(400).send({ error: "duplicate answer sheet" });
      } else {
        res.status(500).send({ error: err.message });
      }
    });
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
    const currentUser: IUserBase | null | undefined = await getCurrentUser<IUserBase>(req);
    if(!currentUser) {
      return res.status(400).send({ error: "Unable to find current user!" });
    }

    await Private.deleteAnswerSheet(req.params.id as string, currentUser._id!.toString()).then(() => res.status(204).send());
}

export async function deleteAnswerSheetFile(req: Request, res: Response) {
    /*
        #swagger.parameters['answerSheetId'] = {
            in: 'path',
            description: 'ID of the answer-sheet',
            required: true,
            type: 'string',
            pattern: '^[0-9a-fA-F]{24}$'
        }
        #swagger.parameters['fileId'] = {
            in: 'path',
            description: 'ID of the answer-sheet',
            required: true,
            type: 'string',
            pattern: '^[0-9a-fA-F]{24}$'
        }
     */
    const currentUser: IUserBase | null | undefined = await getCurrentUser<IUserBase>(req);
    if(!currentUser) {
        return res.status(400).send({ error: "Unable to find current user!" });
    }
    await AnswerSheet.findOne({_id: req.params.answerSheetId as string})
        .populate({
            path: 'exam',
            populate: ['primaryExaminer', 'secondaryExaminer', 'owner']
        })
        .lean<IAnswerSheetPopulated>()
        .exec()
        .then(async (answerSheet: IAnswerSheetPopulated | null) => {
            if(!answerSheet) {throw Error('answer sheet not found');}
            if(!(answerSheet?.exam.primaryExaminer._id?.toString() === currentUser._id!.toString() || answerSheet?.exam.secondaryExaminer?._id?.toString() === currentUser._id!.toString() || answerSheet?.exam.owner._id?.toString() === currentUser._id!.toString())) {
              return res.status(403).send('not permitted to access this answer sheet');
            }

            const file: IFileBase | undefined = answerSheet.files.find((file: IFileBase) => file._id!.toString() === req.params.fileId);
            if(!file){{throw Error('file not found');}}
            if(answerSheet.files.length === 1) {
                await AnswerSheet.deleteOne({_id: answerSheet._id});
            }else {
                await AnswerSheet.updateOne({_id: answerSheet._id}, {$pull: {files: {_id: file._id}}});
            }
            await fs.rm(file.sysFilePath);
            res.send();
        });
}

export async function deleteExam(req: Request, res: Response) {
    /*
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'ID of the exam',
            required: true,
            type: 'string'
        }
        #swagger.responses[204] = {
            description: 'exam',
            content: {}
        }
     */
    const currentUser: IUserBase | null | undefined = await getCurrentUser<IUserBase>(req);
    if(!currentUser) {
        return res.status(400).send({error: 'Unable to find current user!'});
    }

    const exam = await Exam.findOne<Document<IExamBase>>({$and: [
            {_id: req.params.id as string},
            Private.buildAccessFilter(currentUser)
        ]})
        .exec();
    if(!exam) return res.status(404).send({error: 'Unable to find exam'});

    await AnswerSheet.find<Document<IAnswerSheetBase>>({exam: new ObjectId(exam._id.toString())})
        .exec()
        .then(async (answerSheets: Document<IAnswerSheetBase>[] = []) => {
            await Promise.all(
                answerSheets.map(
                    async (answerSheet) => Private.deleteAnswerSheet(answerSheet._id!.toString(), currentUser._id!.toString()) //remove each answer sheet
                )
            );
            await fs.rmdir(path.join(config.fileStorageLocation, exam._id.toString())); //remove directory
            await Exam.deleteOne({_id: exam._id});
            res.status(204).send();
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
    const currentUserData: IUserBase | undefined = getUserFromJwt(req) as IUserBase | undefined;
    if(!currentUserData) {
        return res.status(400).send({error: 'Unable to extract user-data from token!'});
    }
    await User.findOneAndUpdate({uniqueId: currentUserData.uniqueId}, currentUserData, {upsert: true}).lean()
        .then((updatedUser: IUserBase|null) => {
            res.send(updatedUser);
        })
}

namespace Private {
    export async function deleteAnswerSheet(answerSheetId: string, currentUserId: string) {
        await AnswerSheet.findOne<IAnswerSheetPopulated>({_id: answerSheetId as string}).populate({
                path: 'exam',
                populate: ['primaryExaminer', 'secondaryExaminer', 'owner']
            })
            .lean<IAnswerSheetPopulated>()
            .exec()
            .then(async (answerSheet) => {
                if(!(answerSheet?.exam.primaryExaminer._id?.toString() === currentUserId || answerSheet?.exam.secondaryExaminer?._id?.toString() === currentUserId || answerSheet?.exam.owner._id?.toString() === currentUserId)) {
                    throw Error('not permitted to access this answer sheet');
                }
                if(!answerSheet) {throw Error('answer sheet not found');}
                await AnswerSheet.deleteOne({_id: answerSheet._id}); //remove database-enty
                await Promise.all(answerSheet.files.map(async (file) => fs.rm(file.sysFilePath))); //remove all files belonging to this answer-sheet
            });
    }

    export function buildAccessFilter(currentUser: IUserBase): QueryFilter<IExamBase>{
        return {$or: [
                {primaryExaminer: new ObjectId(currentUser._id!.toString())},
                {secondaryExaminer: new ObjectId(currentUser._id!.toString())},
                {owner: new ObjectId(currentUser._id!.toString())}
            ]};
    }
}


