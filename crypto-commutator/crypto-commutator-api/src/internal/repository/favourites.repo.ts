import { DataSource, Repository } from 'typeorm';
import { IFavouritesRepo } from './repository';
import Favourite from '../entities/favourite';

class FavouritesRepo implements IFavouritesRepo {
  repo: Repository<Favourite>;

  constructor(ds: DataSource) {
    this.repo = ds.getRepository(Favourite);
  }

  async findAll(idTg: number): Promise<Favourite[]> {
    const infos = await this.repo.find({
      where: {
        idTg,
      },
    });
    return infos;
  }

  async findOne(idTg: number, name: string): Promise<Favourite | null> {
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

  async save(fav: Favourite): Promise<void> {
    await this.repo.save(fav);
  }

  async delete(idTg: number, name: string): Promise<void> {
    await this.repo.delete({
      idTg,
      name,
    });
  }
}

export default FavouritesRepo;
