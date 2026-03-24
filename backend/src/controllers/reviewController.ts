import {Request, Response} from 'express';
import {Request as JwtRequest} from 'express-jwt';
import {AnswerSheet} from "../models/AnswerSheet";
import {hasRole} from "../middlewares/jwtProtect";
import {config} from "../globals";
import {findCurrentStudent} from "../util/student";
import {IStudent, IUser} from "../interfaces";
import {getUserFromJwt} from "../util/user";
import {User} from "../models/User";
import {Student} from "../models/Student";

export async function getAnswerSheets(req: JwtRequest, res: Response) {
    const student = await findCurrentStudent(req, res);
    if(!student) return;
    return res.send(
      await AnswerSheet.find({ submitter: student })
        .populate({
          path: "exam",
          populate: ["primaryExaminer", "secondaryExaminer"],
        })
        .sort([
          ["exam.semester.year", -1],
          ["exam.semester.season", -1],
          ["exam.title", 1],
        ])
    );
}

export async function getAnswerSheetById(req: Request, res: Response) {
    res.send(await AnswerSheet.findById(req.params.id).lean().populate('exam'));
}

export async function updateStudent(req: JwtRequest, res: Response) {
    const userData: IStudent | undefined = getUserFromJwt(req) as IStudent | undefined;
    if(!userData) {
        return res.status(400).send({error: 'Unable to extract user-data from token!'});
    }
    await Student.findOneAndUpdate({studentId: userData.studentId}, userData, {upsert: true}).lean()
        .then((updatedStudent: IStudent|null) => {
            res.send(updatedStudent);
        })
}
