import { AxiosInstance } from 'axios';
import { InfoCoin, Infos, PushCoin, ResCoin } from './service';
import { CryptoInfos } from '../repository/repository';
import CryptoInfo from '../domain/cryptoInfo';

const getCoinMarketCap = async (axios: AxiosInstance): Promise<ResCoin[]> => {
  const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=25881ef5-9ccd-4a9f-8a8d-b2705b13de7c');
  return response.data.data
    .sort((a: any, b: any) => a.cmc_rank - b.cmc_rank)
    .map((item: any) => new ResCoin(item.symbol, item.quote.USD.price));
};

const getCoinBase = async (axios: AxiosInstance): Promise<ResCoin[]> => {
  const resCoins = await axios.get('https://api.exchange.coinbase.com/currencies');
  const resPrices = await axios.get('https://api.coinbase.com/v2/exchange-rates?currency=USD');
  return resCoins.data
    .filter((item: any) => item.details.type === 'crypto')
    .sort((a: any, b: any) => a.details.sort_order - b.details.sort_order)
    .map((item: any) => new ResCoin(item.id, 1 / resPrices.data.data.rates[item.id]));
};

const getCoinStats = async (axios: AxiosInstance): Promise<ResCoin[]> => {
  const response = await axios.get('https://api.coinstats.app/public/v1/coins?skip=0&currency=USD');
  return response.data.coins
    .sort((a: any, b: any) => a.rank - b.rank)
    .map((item: any) => new ResCoin(item.symbol, item.price));
};

const getKuCoin = async (axios: AxiosInstance): Promise<ResCoin[]> => {
  const response = await axios.get('https://api.kucoin.com/api/v1/prices');
  return Object.keys(response.data.data)
    .map((item: any) => new ResCoin(item, response.data.data[item]));
};

const getCoinPaprika = async (axios: AxiosInstance): Promise<ResCoin[]> => {
  const response = await axios.get('https://api.coinpaprika.com/v1/tickers');
  return response.data
    .sort((a: any, b: any) => a.rank - b.rank)
    .map((item: any) => new ResCoin(item.symbol, item.quotes.USD.price));
};

const getCoins = async (axios: AxiosInstance) => {
  const cm = await getCoinMarketCap(axios);
  const cb = await getCoinBase(axios);
  const cs = await getCoinStats(axios);
  const kc = await getKuCoin(axios);
  const cp = await getCoinPaprika(axios);

  const coinsNames = new Set(
    [...cm, ...cb, ...cs, ...kc, ...cp].map((item: ResCoin) => item.name),
  );
  const coins: PushCoin[] = [];
  const time = Date.now();

  coinsNames.forEach((name: string) => {
    const cmCoins = cm.find((item: ResCoin) => name === item.name);
    const cbCoins = cb.find((item: ResCoin) => name === item.name);
    const csCoins = cs.find((item: ResCoin) => name === item.name);
    const kcCoins = kc.find((item: ResCoin) => name === item.name);
    const cpCoins = kc.find((item: ResCoin) => name === item.name);
    if (cmCoins && cbCoins && csCoins && kcCoins && cpCoins) {
      coins.push(
        new PushCoin(
          name,
          cmCoins.price,
          cbCoins.price,
          csCoins.price,
          kcCoins.price,
          cpCoins.price,
          time,
        ),
      );
    }
    if (coins.length === 30) coinsNames.clear();
  });
  return coins;
};

const getAvgPrice = (arr: number[]) => arr.reduce((sum, item) => sum + item, 0) / arr.length;

class InfosService implements Infos {
  private infosRepo: CryptoInfos;
  private axios: AxiosInstance;
  constructor(infosRepo: CryptoInfos, axios: AxiosInstance) {
    this.infosRepo = infosRepo;
    this.axios = axios;
  }

  async getRecentInfos(): Promise<InfoCoin[]> {
    const infosRepo = await this.infosRepo.findRecentInfos();
    if (!infosRepo) {
      throw new Error('Cannot find any cryptocurrency!');
    }
    const infos = infosRepo.map((item: CryptoInfo) => new InfoCoin(item.name, getAvgPrice([
      item.cmValue,
      item.cbValue,
      item.csValue,
      item.kcValue,
      item.csValue,
    ])));
    return infos;
  }

  async getInfosByName(name: string): Promise<InfoCoin[]> {
    const infosRepo = await this.infosRepo.findInfosByName(name);
    if (!infosRepo) {
      throw new Error('Cannot find cryptocurrency!');
    }
    const infos = infosRepo.map((item: CryptoInfo) => new InfoCoin(item.name, getAvgPrice([
      item.cmValue,
      item.cbValue,
      item.csValue,
      item.kcValue,
      item.csValue,
    ])));
    return infos;
  }

  async saveInfos(): Promise<void> {
    await this.infosRepo.saveInfos(
      (await getCoins(this.axios)).map((item: PushCoin) => new CryptoInfo(
        item.name,
        item.cm,
        item.cb,
        item.cs,
        item.kc,
        item.cs,
        item.createdAt,
      )),
    );
  }
}

export default InfosService;
