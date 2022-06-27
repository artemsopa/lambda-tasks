import { NextFunction, Request, Response, Router } from 'express';
import { Favs } from '../../../service/service';

class FavouriteRoutes {
  constructor(private favService: Favs, private router: Router) {
    this.favService = favService;
    this.router = router;
  }

  initRoutes() {
    this.router.use('/favs', () => {
      this.router.get('/:id', this.getAllFavourite);
    });
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
