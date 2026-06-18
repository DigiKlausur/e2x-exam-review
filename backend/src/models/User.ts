import {IUser} from "../interfaces";
import {model, Model, Schema} from "mongoose";

export const UserSchema: Schema<IUser> = new Schema<IUser>({
    uniqueId: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    firstname: {type: String, required: true},
    lastname: {type: String, required: true}
});

export const User: Model<IUser> = model<IUser>('User', UserSchema);
