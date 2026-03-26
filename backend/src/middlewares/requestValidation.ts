import {validationResult} from "express-validator";
import {Request, Response, NextFunction} from "express";

/**
 * middleware that checks if express-validator found wrong formatting
 *      => returns http-status 400 and interrupts request
 * @param req express request
 * @param res express response
 * @param next callback for next step
 */
export function enforceValidity(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) res.status(400).json(errors.array());
    else next();
}
