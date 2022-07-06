import { AxiosInstance } from 'axios';
import { DateTime } from 'luxon';
import { ApiError, InfoCoin, IInfosService, PushCoin, ResCoin, Urls, CoinPrices, CoinPrice, getAvgPrice } from './service';
import { IInfosRepo } from '../repository/repository';
import Info from '../entities/info';

class InfosService implements IInfosService {
  private times: string[] = ['1m', '30m', '1h', '3h', '6h', '12h', '24h'];
  constructor(private infosRepo: IInfosRepo, private axios: AxiosInstance, private urls: Urls) {
    this.infosRepo = infosRepo;
    this.axios = axios;
    this.urls = urls;
  }

  async getRecentInfos(): Promise<InfoCoin[]> {
    const infosRepo = await this.infosRepo.findRecent();
    if (infosRepo.length === 0) {
      throw ApiError.internal('Internal server error! Cannot find any cryptocurrency!');
    }
    const infos = infosRepo.map((item: Info) => new InfoCoin(item.name, getAvgPrice([
      item.marketCapValue,
      item.coinBaseValue,
      item.coinStatsValue,
      item.kucoinValue,
      item.coinPaprikaValue,
    ])));
    return infos;
  }

  async getInfosByName(name: string): Promise<CoinPrices> {
    const infosRepo = await this.infosRepo.findOneByName(name);
    if (infosRepo.length === 0) {
      throw ApiError.badRequest(`Invalid cryptocurrency name! Cannot get info about ${name.toUpperCase()}!`);
    }
    const prices = infosRepo
      .sort((a, b) => b.time - a.time)
      .map((item: Info, index: number) => new CoinPrice(this.times[index], getAvgPrice([
        item.marketCapValue,
        item.coinBaseValue,
        item.coinStatsValue,
        item.kucoinValue,
        item.coinPaprikaValue,
      ])));
    return new CoinPrices(name, prices);
  }

  async saveInfos(): Promise<void> {
    await this.infosRepo.save(
      (await this.getCoins()).map((item: PushCoin) => new Info(
        item.name,
        item.rank,
        item.marketCap,
        item.coinBase,
        item.coinStats,
        item.kucoin,
        item.coinPaprika,
        item.time,
      )),
    );
  }

  private async getCoins() {
    const marketCap = await this.getMarketCap();
    const coinBase = await this.getCoinBase();
    const coinStats = await this.getCoinStats();
    const kucoin = await this.getKucoin();
    const coinPaprika = await this.getCoinPaprika();

    const coinsNames = new Set(
      [...marketCap, ...coinBase, ...coinStats, ...kucoin, ...coinPaprika]
        .map((item: ResCoin) => item.name),
    );
    const coins: PushCoin[] = [];

    let rank = 0;
    coinsNames.forEach((name: string) => {
      const marketCapCoin = marketCap.find((item: ResCoin) => name === item.name);
      const coinBaseCoin = coinBase.find((item: ResCoin) => name === item.name);
      const coinStatsCoin = coinStats.find((item: ResCoin) => name === item.name);
      const kucoinCoin = kucoin.find((item: ResCoin) => name === item.name);
      const coinPaprikaCoin = coinPaprika.find((item: ResCoin) => name === item.name);
      if (marketCapCoin && coinBaseCoin && coinStatsCoin && kucoinCoin && coinPaprikaCoin) {
        coins.push(
          new PushCoin(
            name,
            rank,
            marketCapCoin.price,
            coinBaseCoin.price,
            coinStatsCoin.price,
            kucoinCoin.price,
            coinPaprikaCoin.price,
            DateTime.now().toMillis(),
          ),
        );
        rank += 1;
      }
      if (coins.length === 30) coinsNames.clear();
    });
    return coins;
  }

  private async getMarketCap(): Promise<ResCoin[]> {
    const response = await this.axios.get(this.urls.marketCap);
    return response.data.data
      .sort((a: any, b: any) => a.cmc_rank - b.cmc_rank)
      .map((item: any) => new ResCoin(item.symbol, item.quote.USD.price));
  }

  private async getCoinBase(): Promise<ResCoin[]> {
    const resCoins = await this.axios.get(this.urls.coinBaseCoins);
    const resPrices = await this.axios.get(this.urls.coinBasePrices);
    return resCoins.data
      .filter((item: any) => item.details.type === 'crypto')
      .sort((a: any, b: any) => a.details.sort_order - b.details.sort_order)
      .map((item: any) => new ResCoin(item.id, 1 / resPrices.data.data.rates[item.id]));
  }

  private async getCoinStats(): Promise<ResCoin[]> {
    const response = await this.axios.get(this.urls.coinStats);
    return response.data.coins
      .sort((a: any, b: any) => a.rank - b.rank)
      .map((item: any) => new ResCoin(item.symbol, item.price));
  }

  private async getKucoin(): Promise<ResCoin[]> {
    const response = await this.axios.get(this.urls.kucoin);
    return Object.keys(response.data.data)
      .map((item: any) => new ResCoin(item, response.data.data[item]));
  }

  private async getCoinPaprika(): Promise<ResCoin[]> {
    const response = await this.axios.get(this.urls.coinPaprika);
    return response.data
      .sort((a: any, b: any) => a.rank - b.rank)
      .map((item: any) => new ResCoin(item.symbol, item.quotes.USD.price));
  }
}

export default InfosService;
