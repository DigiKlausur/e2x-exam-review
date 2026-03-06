import { Request, Response } from 'express';
import {AnswerSheet} from "../models";

export function getAnswerSheets(req: Request, res: Response) {
    res.send([{
        exam: {
            semester: {
                season: 'summer',
                year: 2024
            },
            title: 'Einführung in die Wahrscheinlichkeitstheorie und Statistik',
            primaryExaminer: {
                email: 'john.doe@h-brs.de',
                firstname: 'John',
                lastname: 'Doe'
            },
            secondaryExaminer: {
                email: 'jane.smith@h-brs.de',
                firstname: 'Jane',
                lastname: 'Smith'
            },
            date: new Date('2024-06-24'),
            reviewParameters: {
                startDate: null,
                endDate: null
            }
        },
        submitter: {
            email: 'max.mustermann@smail.inf.h-brs.de',
            firstname: 'Max',
            lastname: 'Mustermann',
            studentId: 123456789
        },
        filePath: 'answer-sheets/sample.pdf'
    } as AnswerSheet])
}
