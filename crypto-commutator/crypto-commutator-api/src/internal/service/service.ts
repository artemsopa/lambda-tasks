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
  rank: number;
  cm: number;
  cb: number;
  cs: number;
  kc: number;
  cp: number;
  time: number;

  constructor(
    name: string,
    rank: number,
    cm: number,
    cb: number,
    cs: number,
    kc: number,
    cp: number,
    time: number,
  ) {
    this.name = name;
    this.rank = rank;
    this.cm = cm;
    this.cb = cb;
    this.cs = cs;
    this.kc = kc;
    this.cp = cp;
    this.time = time;
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

export class CoinPrice {
  time: string;
  price: number;
  constructor(time: string, price: number) {
    this.time = time;
    this.price = price;
  }
}

export class CoinPrices {
  name: string;
  prices: CoinPrice[];
  constructor(name: string, prices: CoinPrice[]) {
    this.name = name;
    this.prices = prices;
  }
}

export interface Infos {
  getRecentInfos(): Promise<InfoCoin[]>;
  getInfosByName(name: string): Promise<CoinPrices>;
  saveInfos(): Promise<void>;
}

export interface Favs {
  getAllFavs(idTg: number): Promise<InfoCoin[]>;
  saveFav(idTg: number, name: string): Promise<void>;
  removeFav(idTg: number, name: string): Promise<void>;
}

export class Urls {
  cm: string;
  cbCoins: string;
  cbPrices: string;
  cs: string;
  kc: string;
  cp: string;
  constructor(
    cm: string,
    cbCoins: string,
    cbPrices: string,
    cs: string,
    kc: string,
    cp: string,
  ) {
    this.cm = cm;
    this.cbCoins = cbCoins;
    this.cbPrices = cbPrices;
    this.cs = cs;
    this.kc = kc;
    this.cp = cp;
  }
}

export const getAvgPrice = (arr: number[]) => arr.reduce((sum, item) => sum + item, 0) / arr.length;

export default class ApiError extends Error {
  status: number;
  errors: any[];

  constructor(status: number, message: string, errors: any[] = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static badRequest(message: string, errors: any[] = []) {
    return new ApiError(400, message, errors);
  }

  static internal(message: string, errors: any[] = []) {
    return new ApiError(500, message, errors);
  }
}

export class Deps {
  repos: Repositories;
  axios: AxiosInstance;
  urls: Urls;
  constructor(repos: Repositories, axios: AxiosInstance, urls: Urls) {
    this.repos = repos;
    this.axios = axios;
    this.urls = urls;
  }
}

export class Services {
  infos: Infos;
  favs: Favs;
  constructor(deps: Deps) {
    this.infos = new InfosService(deps.repos.infos, deps.axios, deps.urls);
    this.favs = new FavsService(deps.repos.favs, deps.repos.infos);
  }
}
