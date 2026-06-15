import {Request, Response} from 'express';
import {Request as JwtRequest} from 'express-jwt';
import {AnswerSheet} from "../models/AnswerSheet";
import {findCurrentStudent} from "../util/student";
import {IStudent, IUser} from "../interfaces";
import {getUserFromJwt} from "../util/user";
import {Student} from "../models/Student";

export async function getAnswerSheets(req: JwtRequest, res: Response) {
    /*
        #swagger.responses[200] = {
            description: 'list of answer-sheets',
            content: {
                "application/json": {
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

    const student = await findCurrentStudent(req, res);
    if(!student) return;
    return res.send(
      await AnswerSheet.find({ submitter: student })
        .populate({
          path: "exam",
          populate: ["primaryExaminer", "secondaryExaminer"]
        })
        .sort([
          ["exam.semester.year", -1],
          ["exam.semester.season", -1],
          ["exam.title", 1],
        ])
    );
}

export async function getAnswerSheetById(req: Request, res: Response) {
    /*
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'ID of the answer-sheet',
            required: true,
            type: 'string',
            pattern: '^[0-9a-fA-F]{24}$'
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
    res.send(await AnswerSheet.findById(req.params.id).lean().populate('exam'));
}

export async function updateStudent(req: JwtRequest, res: Response) {
    /*
        #swagger.responses[200] = {
            description: 'student',
            content: {
                'application/json': {
                    schema: {
                        $ref: '#/components/schemas/student'
                    }
                }
            }
        }
     */
    const userData: IStudent | undefined = getUserFromJwt(req) as IStudent | undefined;
    if(!userData) {
        return res.status(400).send({error: 'Unable to extract user-data from token!'});
    }
    await Student.findOneAndUpdate({studentId: userData.studentId}, userData, {upsert: true}).lean()
        .then((updatedStudent: IStudent|null) => {
            res.send(updatedStudent);
        })
}
