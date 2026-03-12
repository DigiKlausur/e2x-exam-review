import {model, Model, Schema} from "mongoose";
import {IExam} from "../interfaces/IExam";
import {ExamReviewParametersSchema} from "./ExamReviewParameters";
import {SemesterSchema} from "./Semester";

export const ExamSchema: Schema<IExam> = new Schema<IExam>({
    title: {type: String, required: true},
    semester: SemesterSchema,
    primaryExaminer: {type: Schema.Types.ObjectId, ref: "User", required: true},
    secondaryExaminer: {type: Schema.Types.ObjectId, ref: "User", required: true},
    date: {type: Date, required: true},
    reviewParameters: ExamReviewParametersSchema
});

export const Exam: Model<IExam> = model<IExam>('Exam', ExamSchema);
