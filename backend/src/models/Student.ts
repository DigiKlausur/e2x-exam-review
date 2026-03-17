import {model, Model, Schema} from "mongoose";
import {IStudent} from "../interfaces";

export const StudentSchema: Schema<IStudent> = new Schema<IStudent>({
    email: {type: String, unique: true, optional: true, sparse: true},
    firstname: {type: String, optional: true},
    lastname: {type: String, optional: true},
    studentId: {type: Number, unique: true, required: true}
});

export const Student: Model<IStudent> = model<IStudent>('Student', StudentSchema);
