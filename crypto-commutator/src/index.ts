import axios from 'axios';

// const getOldPrice = (price: number, percent: number) => price - price * (percent / 100);
// change1h: getOldPrice(item.quote.USD.price, item.quote.USD.percent_change_1h),
// change1d: getOldPrice(item.quote.USD.price, item.quote.USD.percent_change_24h),
// change1w: getOldPrice(item.quote.USD.price, item.quote.USD.percent_change_7d),

// const getKuCoin = async () => {
//   try {
//     const response = await axios.get('https://api.kucoin.com/api/v1/currencies');
//     console.log(
//       response.data.data.sort((a: any, b:any) => a.precision - b.precision)
//         .slice(0, 1),
//     );
//   } catch (error) {
//     console.log(error);
//   }
// };

class ResCoin {
  name: string;
  price: number;

  constructor(name: string, price: number) {
    this.name = name;
    this.price = price;
  }
}

class Coin {
  name: string;
  cmp: number;
  cs: number;
  cb: number;
  date: number;

  constructor(name: string, cmp: number, cs: number, cb: number, date: number) {
    this.name = name;
    this.cmp = cmp;
    this.cs = cs;
    this.cb = cb;
    this.date = date;
  }
}

const getCoinMarketCap = async () => {
  try {
    const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=25881ef5-9ccd-4a9f-8a8d-b2705b13de7c');
    return response.data.data
      .sort((a: any, b: any) => a.cmc_rank - b.cmc_rank)
      .map((item: any) => new ResCoin(item.symbol, item.quote.USD.price));
  } catch (error) {
    console.log(error);
  }
};

const getCoinStats = async () => {
  try {
    const response = await axios.get('https://api.coinstats.app/public/v1/coins?skip=0&currency=USD');
    return response.data.coins
      .sort((a: any, b: any) => a.rank - b.rank)
      .map((item: any) => new ResCoin(item.symbol, item.price));
  } catch (error) {
    console.log(error);
  }
};

const getCoinBase = async () => {
  try {
    const resCoins = await axios.get('https://api.exchange.coinbase.com/currencies');
    const resPrices = await axios.get('https://api.coinbase.com/v2/exchange-rates?currency=USD');
    return resCoins.data
      .filter((item: any) => item.details.type === 'crypto')
      .sort((a: any, b: any) => a.details.sort_order - b.details.sort_order)
      .map((item: any) => new ResCoin(item.id, 1 / resPrices.data.data.rates[item.id]));
  } catch (error) {
    console.log(error);
  }
};

const getCoins = async () => {
  const cmp = await getCoinMarketCap();
  const cs = await getCoinStats();
  const cb = await getCoinBase();

  const coinsNames = new Set([...cmp, ...cs, ...cb].map((item: ResCoin) => item.name));
  const coins: Coin[] = [];
  const date = Date.now();

  coinsNames.forEach((name: string) => {
    const cmpCoins = cmp.find((item: ResCoin) => name === item.name);
    const csCoins = cs.find((item: ResCoin) => name === item.name);
    const cbCoins = cb.find((item: ResCoin) => name === item.name);
    if (cmpCoins && csCoins && cbCoins) {
      coins.push(new Coin(name, cmpCoins.price, csCoins.price, cbCoins.price, date));
    }
  });
  return coins;
};

getCoins().then((res: any) => {
  console.log(JSON.stringify(res, null, '\t'));
  console.log(res.length);
  // console.log(coinsNames.size);
});
