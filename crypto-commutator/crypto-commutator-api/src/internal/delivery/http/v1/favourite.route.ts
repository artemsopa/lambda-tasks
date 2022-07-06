import { NextFunction, Request, Response, Router } from 'express';
import { IFavouritesService } from '../../../service/service';

class FavouriteRoute {
  constructor(private favService: IFavouritesService) {
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
      const idTg = req.params.id;
      if (!idTg) {
        res.status(400).json({
          message: 'Invalid parameter!',
        });
      }
      res.status(200).json(await this.favService.getAllFavourites(Number(idTg)));
    } catch (error) {
      next(error);
    }
  }

  private async createFavourite(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, name } = req.body;
      if (!id || !name) {
        res.status(400).json({
          message: 'Invalid parameters!',
        });
      }
      await this.favService.saveFavourite(id, name);
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
      if (!id || !name) {
        res.status(400).json({
          message: 'Invalid parameters!',
        });
      }
      await this.favService.removeFavourite(Number(id), String(name));
      res.status(200).json({
        message: 'Favourite deleted!',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default FavouriteRoute;
