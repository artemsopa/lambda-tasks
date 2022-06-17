import { Router } from "express";
import Controller from "../controllers/controller";
import { authToken } from "../middlewares/auth-middleware";

class Handler {
    private controller: Controller;
    private router: Router;
    constructor(controller: Controller, router: Router) {
        this.controller = controller;
        this.router = router
    }

    initRoutes() {
        this.router.post("/sign_up", this.controller.signUp.bind(this.controller));
        this.router.post("/login", this.controller.login.bind(this.controller));
        this.router.use(authToken).post("/refresh", this.controller.refresh.bind(this.controller));
        this.router.use(authToken).get("/me:num", this.controller.me.bind(this.controller));
        return this.router;
    }
}

export default Handler;