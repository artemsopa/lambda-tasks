import { AxiosInstance } from 'axios';
import ApiError, { InfoCoin, Infos, PushCoin, ResCoin, Urls, CoinPrices, CoinPrice, getAvgPrice } from './service';
import { CryptoInfos } from '../repository/repository';
import CryptoInfo from '../domain/cryptoInfo';

class InfosService implements Infos {
  private times: string[] = ['1m', '30m', '1h', '3h', '6h', '12h', '24h'];
  constructor(private infosRepo: CryptoInfos, private axios: AxiosInstance, private urls: Urls) {
    this.infosRepo = infosRepo;
    this.axios = axios;
    this.urls = urls;
  }

  async getRecentInfos(): Promise<InfoCoin[]> {
    const infosRepo = await this.infosRepo.findRecentInfos();
    if (infosRepo.length === 0) {
      throw ApiError.internal('Internal server error! Cannot find any cryptocurrency!');
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

  async getInfosByName(name: string): Promise<CoinPrices> {
    const infosRepo = await this.infosRepo.findRecentPricesByName(name);
    if (infosRepo.length === 0) {
      throw ApiError.badRequest('Invalid cryptocurrency name! Cannot get info!');
    }
    const prices = infosRepo
      .sort((a, b) => b.time - a.time)
      .map((item: CryptoInfo, index: number) => new CoinPrice(this.times[index], getAvgPrice([
        item.cmValue,
        item.cbValue,
        item.csValue,
        item.kcValue,
        item.csValue,
      ])));
    return new CoinPrices(name, prices);
  }

  async saveInfos(): Promise<void> {
    await this.infosRepo.saveInfos(
      (await this.getCoins()).map((item: PushCoin) => new CryptoInfo(
        item.name,
        item.rank,
        item.cm,
        item.cb,
        item.cs,
        item.kc,
        item.cs,
        item.time,
      )),
    );
  }

  private async getCoins() {
    const cm = await this.getCoinMarketCap();
    const cb = await this.getCoinBase();
    const cs = await this.getCoinStats();
    const kc = await this.getKuCoin();
    const cp = await this.getCoinPaprika();

    const coinsNames = new Set(
      [...cm, ...cb, ...cs, ...kc, ...cp].map((item: ResCoin) => item.name),
    );
    const coins: PushCoin[] = [];

    let rank = 0;
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
            rank,
            cmCoins.price,
            cbCoins.price,
            csCoins.price,
            kcCoins.price,
            cpCoins.price,
            Date.now(),
          ),
        );
        rank += 1;
      }
      if (coins.length === 30) coinsNames.clear();
    });
    return coins;
  }

  private async getCoinMarketCap(): Promise<ResCoin[]> {
    const response = await this.axios.get(this.urls.cm);
    return response.data.data
      .sort((a: any, b: any) => a.cmc_rank - b.cmc_rank)
      .map((item: any) => new ResCoin(item.symbol, item.quote.USD.price));
  }

  private async getCoinBase(): Promise<ResCoin[]> {
    const resCoins = await this.axios.get(this.urls.cbCoins);
    const resPrices = await this.axios.get(this.urls.cbPrices);
    return resCoins.data
      .filter((item: any) => item.details.type === 'crypto')
      .sort((a: any, b: any) => a.details.sort_order - b.details.sort_order)
      .map((item: any) => new ResCoin(item.id, 1 / resPrices.data.data.rates[item.id]));
  }

  private async getCoinStats(): Promise<ResCoin[]> {
    const response = await this.axios.get(this.urls.cs);
    return response.data.coins
      .sort((a: any, b: any) => a.rank - b.rank)
      .map((item: any) => new ResCoin(item.symbol, item.price));
  }

  private async getKuCoin(): Promise<ResCoin[]> {
    const response = await this.axios.get(this.urls.kc);
    return Object.keys(response.data.data)
      .map((item: any) => new ResCoin(item, response.data.data[item]));
  }

  private async getCoinPaprika(): Promise<ResCoin[]> {
    const response = await this.axios.get(this.urls.cp);
    return response.data
      .sort((a: any, b: any) => a.rank - b.rank)
      .map((item: any) => new ResCoin(item.symbol, item.quotes.USD.price));
  }
}

export default InfosService;
