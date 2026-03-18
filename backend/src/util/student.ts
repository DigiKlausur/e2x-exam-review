import {Response} from "express";
import {Request as JwtRequest} from 'express-jwt';
import {config} from "../globals";
import {Student} from "../models/Student";
import {IStudent} from "../interfaces";
import {Model} from "mongoose";

export async function findCurrentStudent(req: JwtRequest, res: Response): Promise<Model<IStudent> | null> {
    if(!req.auth?.[config.jwt.attributeMappings.studentId]) {
        res.status(400).send('Student ID not present in JWT');
        return null;
    }
    return Student.findOne({studentId:req.auth[config.jwt.attributeMappings.studentId]});
}
