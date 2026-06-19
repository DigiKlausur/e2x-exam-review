import {model, Model, Schema} from "mongoose";
import {IExamBase} from "../interfaces/IExam";
import {ExamReviewParametersSchema} from "./ExamReviewParameters";
import {SemesterSchema} from "./Semester";

export const ExamSchema: Schema<IExamBase> = new Schema<IExamBase>({
    title: {type: String, required: true},
    semester: SemesterSchema,
    primaryExaminer: {type: Schema.Types.ObjectId, ref: "User", required: true},
    secondaryExaminer: {type: Schema.Types.ObjectId, ref: "User", optional: true},
    date: {type: Date, required: true},
    reviewParameters: ExamReviewParametersSchema,
    owner: {type: Schema.Types.ObjectId, ref: "User", required: true}
});

export const Exam: Model<IExamBase> = model<IExamBase>('Exam', ExamSchema);
