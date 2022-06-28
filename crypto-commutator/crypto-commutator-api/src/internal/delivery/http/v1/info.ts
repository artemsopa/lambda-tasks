import { NextFunction, Request, Response, Router } from 'express';
import { Infos } from '../../../service/service';

class InfoRoutes {
  constructor(private infoService: Infos) {
    this.infoService = infoService;
  }

  initRoutes() {
    const router = Router();
    router.get('/', this.getAllRecent.bind(this));
    router.get('/:name', this.getCrypto.bind(this));
    return router;
  }

  private async getAllRecent(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json(await this.infoService.getRecentInfos());
    } catch (error) {
      next(error);
    }
  }

  private async getCrypto(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.params;
      res.status(200).json(await this.infoService.getInfosByName(name));
    } catch (error) {
      next(error);
    }
  }
}

export default InfoRoutes;
