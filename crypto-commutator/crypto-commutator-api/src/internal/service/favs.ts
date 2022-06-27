import { CryptoFavs } from '../repository/repository';
import { Favs, InfoCoin } from './service';
import CryptoFav from '../domain/cryptoFav';

class FavsService implements Favs {
  favsRepo: CryptoFavs;
  constructor(favsRepo: CryptoFavs) {
    this.favsRepo = favsRepo;
  }

  async getAllFavs(idTg: number): Promise<InfoCoin[]> {
    const infoRepos = await this.favsRepo.findAllFavs(idTg);
    if (!infoRepos) {
      throw new Error('Cannot find any favourite coin!');
    }
    return infoRepos.map((item: CryptoFav) => new InfoCoin(item.name, item.idTg));
  }

  async saveFav(idTg: number, name: string): Promise<void> {
    const infoRepo = await this.favsRepo.findFav(idTg, name);
    if (infoRepo) {
      throw new Error('Favourite already exists!');
    } else await this.favsRepo.deleteFav(idTg, name);
  }

  async removeFav(idTg: number, name: string): Promise<void> {
    const infoRepo = await this.favsRepo.findFav(idTg, name);
    if (!infoRepo) {
      throw new Error('Cannot find favourite!');
    } else await this.favsRepo.deleteFav(idTg, name);
  }
}

export default FavsService;
