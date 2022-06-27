import express, { Express, Router } from 'express';
import { Services } from '../service/service';
import Handler from './http/handler';

class Server {
  services: Services;
  port: number;
  constructor(services: Services, port: number) {
    this.services = services;
    this.port = port;
  }

  initServer() {
    const app: Express = express();
    const router: Router = Router();
    app.use(express.json());
    app.use(this.initAPI(router));

    app.listen(this.port, () => console.log('Server is running!'));
  }

  private initAPI(router: Router) {
    return router.use('/api', () => {
      new Handler(this.services, router).initRoutes();
    });
  }
}

export default Server;
