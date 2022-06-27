import { Router } from 'express';
import { Services } from '../../service/service';
import InfoRoutes from './v1/info';
import FavouriteRoutes from './v1/favoutire';

class Handler {
  constructor(private services: Services, private router: Router) {
    this.services = services;
    this.router = router;
  }

  initRoutes() {
    this.router.use('/v1', () => {
      new InfoRoutes(this.services.infos, this.router).initRoutes();
      new FavouriteRoutes(this.services.favs, this.router).initRoutes();
    });
  }
}

export default Handler;
