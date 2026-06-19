import {Request as JwtRequest} from "express-jwt";
import {IStudentBase} from "../interfaces/IStudent";
import {config} from "../globals";
import {User} from "../models/User";
import {Student} from "../models/Student";
import {IUserBase} from "../interfaces/IUser";

export function getUserFromJwt(request: JwtRequest): IUserBase | IStudentBase | undefined {
    if(!request.auth) return undefined;
    return {
        uniqueId: request.auth[config.jwt.attributeMappings.uniqueId],
        email: request.auth[config.jwt.attributeMappings.email],
        firstname: request.auth[config.jwt.attributeMappings.firstname],
        lastname: request.auth[config.jwt.attributeMappings.lastname],
        studentId: request.auth[config.jwt.attributeMappings.studentId] ?? undefined
    };
}

export async function getCurrentUser<T extends IUserBase | IStudentBase>(req: JwtRequest): Promise<T | null> {
    const currentUserData: T | undefined = getUserFromJwt(req) as T | undefined;
    if(!currentUserData) return null;
    if((currentUserData as IStudentBase).studentId) {
        return Student.findOne<T>({uniqueId: currentUserData!.uniqueId as string}).lean<T>().exec();
    }
    return User.findOne<T>({uniqueId: currentUserData!.uniqueId as string}).lean<T>().exec();
}
