import { NextFunction, Request, Response } from "express";
import ApiError from "../exceptions/api-error";
import { TokenRequest } from "../models/models";

export function authToken(req: TokenRequest, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader) {
            return next(ApiError.unauthorizedError());
        }

        const token = authHeader.split(' ')[1];
        if(!token) {
            return next(ApiError.unauthorizedError());
        }
        req.token = token;
        next();
    } catch (error) {
        return next(ApiError.unauthorizedError());
    }
}