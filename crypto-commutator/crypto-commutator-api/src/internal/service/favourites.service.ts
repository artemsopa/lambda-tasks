import { ApiError, IFavouritesService, getAvgPrice, InfoCoin } from './service';
import { IFavouritesRepo, IInfosRepo } from '../repository/repository';
import Info from '../entities/info';
import Favourite from '../entities/favourite';

class FavouritesService implements IFavouritesService {
  favsRepo: IFavouritesRepo;
  infosRepo: IInfosRepo;
  constructor(favsRepo: IFavouritesRepo, infosRepo: IInfosRepo) {
    this.favsRepo = favsRepo;
    this.infosRepo = infosRepo;
  }

  async getAllFavourites(idTg: number): Promise<InfoCoin[]> {
    const favsRepos = await this.favsRepo.findAll(idTg);
    const infosRepos = await this.infosRepo.findAllByNames(
      favsRepos.map((item: Favourite) => item.name),
    );
    return infosRepos.map((item: Info) => new InfoCoin(item.name, getAvgPrice([
      item.marketCapValue,
      item.coinBaseValue,
      item.coinStatsValue,
      item.kucoinValue,
      item.coinPaprikaValue,
    ])));
  }

  async saveFavourite(idTg: number, name: string): Promise<void> {
    const infoRepo = await this.favsRepo.findOne(idTg, name);
    if (infoRepo) {
      throw ApiError.badRequest('Favourite already exists!');
    }
    const info = await this.infosRepo.findAllByNames([name]);
    if (info.length === 0) {
      throw ApiError.badRequest('Unknown cryptocurrency!');
    }
    await this.favsRepo.save(new Favourite(idTg, name));
  }

  async removeFavourite(idTg: number, name: string): Promise<void> {
    const infoRepo = await this.favsRepo.findOne(idTg, name);
    if (!infoRepo) {
      throw ApiError.badRequest('Favourite does not exist!');
    }
    await this.favsRepo.delete(idTg, name);
  }
}

export default FavouritesService;
