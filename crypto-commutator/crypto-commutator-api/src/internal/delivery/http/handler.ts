import { Router } from 'express';
import Services from '../../service/service';
import InfoRoutes from './v1/info';
import FavouriteRoutes from './v1/favoutire';

class Handler {
  constructor(private services: Services) {
    this.services = services;
  }

  initHandler() {
    const router = Router();
    router.use('/v1', this.initV1Routes());
    return router;
  }

  private initV1Routes() {
    const router = Router();
    router.use('/infos', new InfoRoutes(this.services.infos).initRoutes());
    router.use('/favs', new FavouriteRoutes(this.services.favs).initRoutes());
    return router;
  }
}

export default Handler;
