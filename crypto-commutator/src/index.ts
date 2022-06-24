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

const getCoinMarketCap = async () => {
  try {
    const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=25881ef5-9ccd-4a9f-8a8d-b2705b13de7c');
    return response.data.data.sort((a: any, b:any) => a.cmc_rank - b.cmc_rank)
      .map((item: any) => ({
        name: item.symbol,
        usd: item.quote.USD.price,
      }));
  } catch (error) {
    console.log(error);
  }
};

const getCoinStats = async () => {
  try {
    const response = await axios.get('https://api.coinstats.app/public/v1/coins?skip=0&currency=USD');
    return response.data.coins.sort((a: any, b:any) => a.rank - b.rank)
      .map((item: any) => ({
        name: item.symbol,
        usd: item.price,
      }));
  } catch (error) {
    console.log(error);
  }
};

const getCoinBase = async () => {
  try {
    const responseC = await axios.get('https://api.exchange.coinbase.com/currencies');
    const responseV = await axios.get('https://api.coinbase.com/v2/exchange-rates?currency=USD');
    return responseC.data.filter((itemC: any) => itemC.details.type === 'crypto').sort((a: any, b:any) => a.details.sort_order - b.details.sort_order)
      .map((itemC: any) => ({
        name: itemC.id,
        usd: 1 / responseV.data.data.rates[itemC.id],
      }));
  } catch (error) {
    console.log(error);
  }
};

class MarketPrices {
  coinMarketCap?: number;

  coinStats?: number;

  coinBase?: number;

  public setCoinMarketCap(usd: number) {
    this.coinMarketCap = usd;
  }
}

const getCoins = async () => {
  const cmp = await getCoinMarketCap() || [];
  const cs = await getCoinStats() || [];
  const cb = await getCoinBase() || [];

  console.log(new MarketPrices());
  const coinsNames = new Set([...cmp, ...cs, ...cb].map((item: any) => item.name));
  const date = Date.now();
  const result: any[] = [];

  coinsNames.forEach((item: any) => {
    const v1 = cmp.find((itemCmp: any) => item === itemCmp.name);
    const v2 = cs.find((itemCmp: any) => item === itemCmp.name);
    const v3 = cb.find((itemCmp: any) => item === itemCmp.name);
    if (v1 && v2 && v3) {
      result.push({
        name: item,
        vals: {
          cmp: v1.usd,
          cs: v2.usd,
          cb: v3.usd,
        },
        date: new Date(date),
      });
    }
  });
  // result.length = 5;
  console.log(JSON.stringify(result, null, '\t'));
  console.log(result.length);
  console.log(coinsNames.size);
};

getCoins();
