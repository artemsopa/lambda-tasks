import express, { Express, Router } from 'express';
import { Services } from '../service/service';
import Handler from './http/handler';

class Server {
  constructor(private services: Services, private port: number) {
    this.services = services;
    this.port = port;
  }

  initServer() {
    const app: Express = express();
    app.use(express.json());
    app.use(this.initAPI());
    app.listen(this.port, () => console.log('Server is running!'));
  }

  private initAPI() {
    const router: Router = Router();
    const v1 = new Handler(this.services);
    router.use('/api', v1.initHandler());
    return router;
  }
}

export default Server;
