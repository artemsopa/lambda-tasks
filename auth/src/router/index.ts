import { Request, Response, Router } from "express";
import Controller from "../controllers/controller";

class Handler {
    private controller: Controller;
    private router: Router;
    constructor(controller: Controller, router: Router) {
        this.controller = controller;
        this.router = router
    }

    initRoutes() {
        this.router.post("/sign_up", this.controller.signUp);
        this.router.post("/login", this.controller.login);
        this.router.post("/refresh", this.controller.refresh);
        this.router.get("/me", (req: Request, res: Response) => {
            res.json({
                message: "Well done!"
            });
        });
        return this.router;
    }
}

export default Handler;