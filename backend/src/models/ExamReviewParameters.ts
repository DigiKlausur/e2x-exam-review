import {Schema} from "mongoose";
import {IExamReviewParameters} from "../interfaces";

export const ExamReviewParametersSchema: Schema<IExamReviewParameters> = new Schema<IExamReviewParameters>({
    startDate: {type: Date, required: false},
    endDate: {type: Date, required: false},
    showDownloadButton: {type: Boolean, required: true},
    showTextLayer: {type: Boolean, required: true}
});
