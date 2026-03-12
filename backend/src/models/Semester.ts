import {Schema} from "mongoose";
import {ISemester} from "../interfaces";

export const SemesterSchema: Schema<ISemester> = new Schema<ISemester>({
   year: {type: Number, required: true},
   season: {type: String, required: true}
});
