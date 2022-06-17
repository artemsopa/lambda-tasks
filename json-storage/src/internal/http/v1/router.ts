import Controller from "./controllers/controller";
import { IncomingMessage, ServerResponse } from 'http';

class Router {
    private controller: Controller;
    constructor(controller: Controller) {
        this.controller = controller;
    }

    initRoutes(request: IncomingMessage, response: ServerResponse) {
        if (request.method === 'GET') {
            this.controller.getInfoBody(request, response);
        }
        if (request.method === 'POST') {
            this.controller.createInfoBody(request, response);
        }
    }
}

export default Router;