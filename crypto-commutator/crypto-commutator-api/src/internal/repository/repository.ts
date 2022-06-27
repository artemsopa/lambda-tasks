/* eslint-disable no-unused-vars */
import { DataSource } from 'typeorm';
import CryptoFav from '../domain/cryptoFav';
import CryptoInfo from '../domain/cryptoInfo';
import CryptoInfosRepo from './cryptoInfos';
import CryptoFavsRepo from './cryptoFavs';

export interface CryptoInfos {
  findRecentInfos(): Promise<CryptoInfo[] | undefined>;
  findInfosByName(name: string): Promise<CryptoInfo[] | undefined>;
  saveInfos(infos: CryptoInfo[]): Promise<void>;
}

export interface CryptoFavs {
  findAllFavs(idTg: number): Promise<CryptoFav[] | undefined>;
  findFav(idTg: number, name: string): Promise<CryptoFav | null>;
  saveFav(fav: CryptoFav): Promise<void>;
  deleteFav(idTg: number, name: string): Promise<void>;
}

class Repositories {
  infos: CryptoInfos;
  favs: CryptoFavs;

  constructor(ds: DataSource) {
    this.infos = new CryptoInfosRepo(ds);
    this.favs = new CryptoFavsRepo(ds);
  }
}

export default Repositories;
