import {model, Model, Schema} from "mongoose";
import {IAnswerSheetBase} from "../interfaces/IAnswerSheet";
import { FileSchema } from "./File";

export const AnswerSheetSchema: Schema<IAnswerSheetBase> = new Schema<IAnswerSheetBase>({
    exam: {type: Schema.Types.ObjectId, ref: 'Exam', required: true},
    submitter: {type: Schema.Types.ObjectId, ref: 'Student', required: true},
    files: [FileSchema]
});

AnswerSheetSchema.index({exam: 1, submitter: 1}, {unique: true});

export const AnswerSheet: Model<IAnswerSheetBase> = model<IAnswerSheetBase>('AnswerSheet', AnswerSheetSchema);
