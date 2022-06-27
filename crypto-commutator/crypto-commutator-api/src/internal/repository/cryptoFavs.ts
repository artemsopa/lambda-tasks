import { DataSource, Repository } from 'typeorm';
import { CryptoFavs } from './repository';
import CryptoFav from '../domain/cryptoFav';

class CryptoFavsRepo implements CryptoFavs {
  repo: Repository<CryptoFav>;

  constructor(ds: DataSource) {
    this.repo = ds.getRepository(CryptoFav);
  }

  async findAllFavs(idTg: number): Promise<CryptoFav[] | undefined> {
    const infos = await this.repo.find({
      where: {
        idTg,
      },
    });
    return infos;
  }

  async findFav(idTg: number, name: string): Promise<CryptoFav | null> {
    const info = await this.repo.findOne(
      {
        where: {
          idTg,
          name,
        },
      },
    );
    return info;
  }

  async saveFav(fav: CryptoFav): Promise<void> {
    await this.repo.save(fav);
  }

  async deleteFav(idTg: number, name: string): Promise<void> {
    await this.repo.delete({
      idTg,
      name,
    });
  }
}

export default CryptoFavsRepo;
