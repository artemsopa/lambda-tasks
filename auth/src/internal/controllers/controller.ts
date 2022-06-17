import { NextFunction, Request, Response } from "express";
import ApiError from "../exceptions/api-error";
import { TokenRequest, Tokens } from "../models/models";
import { Auth, Profile } from "../service/service";

class Controller {
    private authService: Auth;
    private profile: Profile;
    constructor(authService: Auth, profile: Profile) {
        this.authService = authService;
        this.profile = profile;
    }

    async signUp(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            if(!email || !password) {
                throw ApiError.badRequest("not valid body")
            }
            await this.authService.signUp(email, password);
            return res.status(201).json({
                message: "successfully registrated"
            })
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const email = req.query.email;
            const password = req.query.password;
            if(!email || !password) {
                throw ApiError.badRequest("not valid query params")
            }
            const tokens: Tokens = await this.authService.login(email.toString(), password.toString());
            return res.status(200).json(tokens)
        } catch (error) {
            next(error);
        }
    }

    async refresh(req: TokenRequest, res: Response, next: NextFunction) {
        try {
            const token = req.token;
            if(!token) {
                return next(ApiError.unauthorizedError());
            }
            const tokens = await this.authService.refresh(token)
            return res.status(200).json(tokens)
        } catch (error) {
            next(error);
        }
    }

    async me(req: TokenRequest, res: Response, next: NextFunction) {
        try {
            const token = req.token;
            if(!token) {
                return next(ApiError.unauthorizedError());
            }
            const num = Number(req.params.num)
            if(num < 0 || num > 9) {
                return next(new ApiError(400, "invalid parameter length"));
            }
            const user = await this.profile.me(token);
            return res.status(200).json({
                request_num: num,
                user: user
            })
        } catch (error) {
            next(error);
        }
    }
}

export default Controller;