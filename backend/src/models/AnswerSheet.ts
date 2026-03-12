import {model, Model, Schema} from "mongoose";
import {IAnswerSheet} from "../interfaces/IAnswerSheet";

export const AnswerSheetSchema: Schema<IAnswerSheet> = new Schema<IAnswerSheet>({
    exam: {type: Schema.Types.ObjectId, ref: 'Exam', required: true},
    submitter: {type: Schema.Types.ObjectId, ref: 'Student', required: true},
    filePath: {type: String, required: true}
});

export const AnswerSheet: Model<IAnswerSheet> = model<IAnswerSheet>('AnswerSheet', AnswerSheetSchema);
