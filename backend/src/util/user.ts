import {Request as JwtRequest} from "express-jwt";
import {IStudent, IUser} from "../interfaces";
import {config} from "../globals";
import {User} from "../models/User";

export function getUserFromJwt(request: JwtRequest): IUser | IStudent | undefined {
    if(!request.auth) return undefined;
    return {
        email: request.auth[config.jwt.attributeMappings.email],
        firstname: request.auth[config.jwt.attributeMappings.firstname],
        lastname: request.auth[config.jwt.attributeMappings.lastname],
        studentId: request.auth[config.jwt.attributeMappings.studentId] ?? undefined
    };
}

export async function getCurrentUser(req: JwtRequest): Promise<IUser | null | undefined> {
    const currentUserData: IUser | undefined = getUserFromJwt(req) as IUser | undefined;
    return User.findOne({email: currentUserData!.email as string}).lean();
}
