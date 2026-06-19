import {model, Model, Schema} from "mongoose";
import {IStudentBase} from "../interfaces/IStudent";

export const StudentSchema: Schema<IStudentBase> = new Schema<IStudentBase>({
    uniqueId: {type: String, unique: true, optional: true, sparse: true},
    email: {type: String, unique: true, optional: true, sparse: true},
    firstname: {type: String, optional: true},
    lastname: {type: String, optional: true},
    studentId: {type: Number, unique: true, required: true}
});

export const Student: Model<IStudentBase> = model<IStudentBase>('Student', StudentSchema);
