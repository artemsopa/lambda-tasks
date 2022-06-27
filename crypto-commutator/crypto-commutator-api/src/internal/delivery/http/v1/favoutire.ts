import { NextFunction, Request, Response, Router } from 'express';
import { Favs } from '../../../service/service';

class FavouriteRoutes {
  constructor(private favService: Favs) {
    this.favService = favService;
  }

  initRoutes() {
    const router = Router();
    router.get('/:id', this.getAllFavourite.bind(this));
    return router;
  }

  private async getAllFavourite(req: Request, res: Response, next: NextFunction) {
    try {
      const idTg = Number(req.params.id);
      res.status(200).json(await this.favService.getAllFavs(idTg));
    } catch (error) {
      next(error);
    }
  }
}

export default FavouriteRoutes;
