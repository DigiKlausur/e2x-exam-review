import {model, Model, Schema} from "mongoose";
import {IStudent} from "../interfaces";

export const StudentSchema: Schema<IStudent> = new Schema<IStudent>({
    email: {type: String, unique: true, required: true},
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    studentId: {type: Number, unique: true, required: true}
});

export const Student: Model<IStudent> = model<IStudent>('Student', StudentSchema);
