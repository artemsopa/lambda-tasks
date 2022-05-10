import express, { Express, Router } from "express";
import cors from "cors";
import Controller from "../controllers/controller";
import Handler from "../router";
import errorMiddleware from "../middlewares/error-middleware"

async function newServer(port: string, controller: Controller) {

    const app: Express = express();
    const router: Router = Router();
    const handler: Handler = new Handler(controller, router);
    app.use(express.json());
    app.use(cors());
    app.use(handler.initRoutes());
    app.use(errorMiddleware);

    app.listen(port, () => {
        console.log(`Server is running at https://localhost:${port}`);
    })
}

export default newServer;