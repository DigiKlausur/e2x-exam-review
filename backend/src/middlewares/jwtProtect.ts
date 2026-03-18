import {NextFunction, Request, Response} from "express";
import {Request as JWTRequest} from "express-jwt";

/**
 * @param spec one / a list of alternative accepted roles
 */
export function jwtProtect(spec: string | string[]){
    return function protect(request: JWTRequest, response: Response, next: NextFunction) {
        if(request.auth){
            if(
                typeof spec === 'string' && hasRole(request, spec)
                || Array.isArray(spec) && spec.some((role: string) => hasRole(request, role))
            ){
                return next();
            }
        }
        return accessDenied(request, response, next);
    }
}

export function hasRole(request: JWTRequest, role: string): boolean {
    return request.auth?.realm_access.roles.includes(role) ?? false;
}

export function accessDenied(request: Request, response: Response, next: NextFunction){
    response.status(403).send('Access denied');
}
