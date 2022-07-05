import { AxiosInstance } from 'axios';
import Repositories from '../repository/repository';
import FavouritesService from './favourites.service';
import InfosService from './infos.service';

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
  marketCap: number;
  coinBase: number;
  coinStats: number;
  kucoin: number;
  coinPaprika: number;
  time: number;

  constructor(
    name: string,
    rank: number,
    marketCap: number,
    coinBase: number,
    coinStats: number,
    kucoin: number,
    coinPaprika: number,
    time: number,
  ) {
    this.name = name;
    this.rank = rank;
    this.marketCap = marketCap;
    this.coinBase = coinBase;
    this.coinStats = coinStats;
    this.kucoin = kucoin;
    this.coinPaprika = coinPaprika;
    this.time = time;
  }
}

export class InfoCoin {
  name: string;
  price: number;

  constructor(
    name: string,
    price: number,
  ) {
    this.name = name;
    this.price = price;
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

export interface IInfosService {
  getRecentInfos(): Promise<InfoCoin[]>;
  getInfosByName(name: string): Promise<CoinPrices>;
  saveInfos(): Promise<void>;
}

export interface IFavouritesService {
  getAllFavourites(idTg: number): Promise<InfoCoin[]>;
  saveFavourite(idTg: number, name: string): Promise<void>;
  removeFavourite(idTg: number, name: string): Promise<void>;
}

export class Urls {
  marketCap: string;
  coinBaseCoins: string;
  coinBasePrices: string;
  coinStats: string;
  kucoin: string;
  coinPaprika: string;
  constructor(
    marketCap: string,
    coinBaseCoins: string,
    coinBasePrices: string,
    coinStats: string,
    kucoin: string,
    coinPaprika: string,
  ) {
    this.marketCap = marketCap;
    this.coinBaseCoins = coinBaseCoins;
    this.coinBasePrices = coinBasePrices;
    this.coinStats = coinStats;
    this.kucoin = kucoin;
    this.coinPaprika = coinPaprika;
  }
}

export const getAvgPrice = (arr: number[]) => arr.reduce((sum, item) => sum + item, 0) / arr.length;

export class ApiError extends Error {
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

class Services {
  infos: IInfosService;
  favs: IFavouritesService;
  constructor(deps: Deps) {
    this.infos = new InfosService(deps.repos.infos, deps.axios, deps.urls);
    this.favs = new FavouritesService(deps.repos.favs, deps.repos.infos);
  }
}

export default Services;
