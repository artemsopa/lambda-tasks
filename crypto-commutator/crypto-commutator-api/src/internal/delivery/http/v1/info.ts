import { NextFunction, Request, Response, Router } from 'express';
import { Infos } from '../../../service/service';

class InfoRoutes {
  private infoService: Infos;
  private router: Router;
  constructor(infoService: Infos, router: Router) {
    this.infoService = infoService;
    this.router = router;
  }

  initRoutes() {
    this.router.use('/infos', () => {
      this.router.get('/', this.getAllRecent);
    });
  }

  private async getAllRecent(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json(await this.infoService.getRecentInfos());
    } catch (error) {
      next(error);
    }
  }
}

export default InfoRoutes;
