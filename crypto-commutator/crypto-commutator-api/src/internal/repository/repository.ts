import { DataSource } from 'typeorm';
import Favourite from '../entities/favourite';
import Info from '../entities/info';
import InfosRepo from './info.repo';
import FavouritesRepo from './favourites.repo';

export interface IInfosRepo {
  findRecent(): Promise<Info[]>;
  findAllByNames(names: string[]): Promise<Info[]>;
  findOneByName(name: string): Promise<Info[]>;
  save(infos: Info[]): Promise<void>;
}

export interface IFavouritesRepo {
  findAll(idTg: number): Promise<Favourite[]>;
  findOne(idTg: number, name: string): Promise<Favourite | null>;
  save(fav: Favourite): Promise<void>;
  delete(idTg: number, name: string): Promise<void>;
}

class Repositories {
  infos: IInfosRepo;
  favs: IFavouritesRepo;

  constructor(ds: DataSource) {
    this.infos = new InfosRepo(ds);
    this.favs = new FavouritesRepo(ds);
  }
}

export default Repositories;
