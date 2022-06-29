import { NextFunction, Request, Response, Router } from 'express';
import { Favs } from '../../../service/service';

class FavouriteRoutes {
  constructor(private favService: Favs) {
    this.favService = favService;
  }

  initRoutes() {
    const router = Router();
    router.get('/:id', this.getAllFavourite.bind(this));
    router.post('/', this.createFavourite.bind(this));
    router.delete('/', this.deleteFavourite.bind(this));
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

  private async createFavourite(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, name } = req.body;
      await this.favService.saveFav(id, name);
      res.status(200).json({
        message: 'Favourite created!',
      });
    } catch (error) {
      next(error);
    }
  }

  private async deleteFavourite(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, name } = req.query;
      await this.favService.removeFav(Number(id), String(name));
      res.status(200).json({
        message: 'Favourite deleted!',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default FavouriteRoutes;
