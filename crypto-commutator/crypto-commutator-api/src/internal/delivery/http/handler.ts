import { Router } from 'express';
import Services from '../../service/service';
import InfoRoute from './v1/info.route';
import FavouriteRoute from './v1/favourite.route';

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
    router.use('/infos', new InfoRoute(this.services.infos).initRoutes());
    router.use('/favs', new FavouriteRoute(this.services.favs).initRoutes());
    return router;
  }
}

export default Handler;
