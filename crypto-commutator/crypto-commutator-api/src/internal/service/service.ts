/* eslint-disable no-unused-vars */
import { AxiosInstance } from 'axios';
import Repositories from '../repository/repository';
import FavsService from './favs';
import InfosService from './infos';

export class ResCoin {
  name: string;
  price: number;

  constructor(name: string, price: number) {
    this.name = name;
    this.price = price;
  }
}

export class PushCoin {
  name: string;
  cm: number;
  cb: number;
  cs: number;
  kc: number;
  cp: number;
  createdAt: number;

  constructor(
    name: string,
    cm: number,
    cb: number,
    cs: number,
    kc: number,
    cp: number,
    createdAt: number,
  ) {
    this.name = name;
    this.cm = cm;
    this.cb = cb;
    this.cs = cs;
    this.kc = kc;
    this.cp = cp;
    this.createdAt = createdAt;
  }
}

export class InfoCoin {
  name: string;
  avgPrice: number;

  constructor(
    name: string,
    avgPrice: number,
  ) {
    this.name = name;
    this.avgPrice = avgPrice;
  }
}

export interface Infos {
  getRecentInfos(): Promise<InfoCoin[]>;
  getInfosByName(name: string): Promise<InfoCoin[]>;
  saveInfos(infos: PushCoin[]): Promise<void>;
}

export interface Favs {
  getAllFavs(idTg: number): Promise<InfoCoin[]>;
  saveFav(idTg: number, name: string): Promise<void>;
  removeFav(idTg: number, name: string): Promise<void>;
}

export class Deps {
  repos: Repositories;
  axios: AxiosInstance;
  constructor(repos: Repositories, axios: AxiosInstance) {
    this.repos = repos;
    this.axios = axios;
  }
}

export class Services {
  infos: Infos;
  favs: Favs;
  constructor(deps: Deps) {
    this.infos = new InfosService(deps.repos.infos, deps.axios);
    this.favs = new FavsService(deps.repos.favs);
  }
}
