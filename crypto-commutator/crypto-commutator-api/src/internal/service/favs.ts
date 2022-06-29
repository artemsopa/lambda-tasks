import { CryptoFavs, CryptoInfos } from '../repository/repository';
import { Favs, getAvgPrice, InfoCoin } from './service';
import CryptoFav from '../domain/cryptoFav';
import CryptoInfo from '../domain/cryptoInfo';

class FavsService implements Favs {
  favsRepo: CryptoFavs;
  infosRepo: CryptoInfos;
  constructor(favsRepo: CryptoFavs, infosRepo: CryptoInfos) {
    this.favsRepo = favsRepo;
    this.infosRepo = infosRepo;
  }

  async getAllFavs(idTg: number): Promise<InfoCoin[]> {
    const favsRepos = await this.favsRepo.findAllFavs(idTg);
    if (favsRepos.length === 0) {
      throw new Error('Cannot find any favourite coin!');
    }
    const infosRepos = await this.infosRepo.findInfosByNames(
      favsRepos.map((item: CryptoFav) => item.name),
    );
    return infosRepos.map((item: CryptoInfo) => new InfoCoin(item.name, getAvgPrice([
      item.cmValue,
      item.cbValue,
      item.csValue,
      item.kcValue,
      item.csValue,
    ])));
  }

  async saveFav(idTg: number, name: string): Promise<void> {
    const infoRepo = await this.favsRepo.findFav(idTg, name);
    if (infoRepo) {
      throw new Error('Favourite already exists!');
    }
    const info = await this.infosRepo.findInfosByNames([name]);
    if (info.length === 0) {
      throw new Error('Unknown cryptocurrency!');
    }
    await this.favsRepo.saveFav(new CryptoFav(idTg, name));
  }

  async removeFav(idTg: number, name: string): Promise<void> {
    const infoRepo = await this.favsRepo.findFav(idTg, name);
    if (!infoRepo) {
      throw new Error('Cannot find favourite!');
    }
    await this.favsRepo.deleteFav(idTg, name);
  }
}

export default FavsService;
