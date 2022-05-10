import { NextFunction, Request, Response } from "express";
import { Auth } from "../service/service";

class Controller {
    private authService: Auth;
    constructor(authService: Auth) {
        this.authService = authService;
    }

    async signUp(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            if(!email || !password) {
                throw new Error("not valid body")
            }
            await this.authService.signUp(email, password);
        } catch (error) {
            
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            
        } catch (error) {
            
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            
        } catch (error) {
            
        }
    }

    async me(req: Request, res: Response, next: NextFunction) {
        try {
            res.json(["123", "123", "123"])
        } catch (error) {
            
        }
    }
}

export default Controller;