import {IUserBase} from "../interfaces/IUser";
import {model, Model, Schema} from "mongoose";

export const UserSchema: Schema<IUserBase> = new Schema<IUserBase>({
    uniqueId: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    firstname: {type: String, required: true},
    lastname: {type: String, required: true}
});

export const User: Model<IUserBase> = model<IUserBase>('User', UserSchema);
