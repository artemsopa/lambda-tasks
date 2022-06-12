const axios = require("axios");

const urlMono = "https://api.monobank.ua/bank/currency";
const urlPrivat =
  "https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5";

let val = [];

const getMono = async (i) => {
  try {
    const response = await axios.get(urlMono);
    if (response) val[0] = response.data;
    console.log(val);
    return (
      "\n\t*Monobank:*\n\t ↖️ Buy: *\t" +
      Number(val[0][i].rateBuy).toFixed(2) +
      "₴*" +
      "\n\t ↘️ Sell: *\t" +
      Number(val[0][i].rateSell).toFixed(2) +
      "₴*"
    );
  } catch (error) {
    console.log(error.message);
    if (val[0]) {
      return (
        "\n\t*Monobank:*\n\t ↖️ Buy: *\t" +
        Number(val[0][i].rateBuy).toFixed(2) +
        "₴*" +
        "\n\t ↘️ Sell: *\t" +
        Number(val[0][i].rateSell).toFixed(2) +
        "₴*"
      );
    } else return error.message;
  }
};

const getPrivat = async (i) => {
  try {
    const response = await axios.get(urlPrivat);
    if (response) val[1] = response.data;
    console.log(val);
    return (
      "\n\t*PrivatBank:*\n\t ↖️ Buy: *\t" +
      Number(val[1][i].buy).toFixed(2) +
      "₴*" +
      "\n\t ↘️ Sell: *\t" +
      Number(val[1][i].sale).toFixed(2) +
      "₴*"
    );
  } catch (error) {
    console.log(error.message);
    if (val[1]) {
      return (
        "\n\t*PrivatBank:*\n\t ↖️ Buy: *\t" +
        Number(val[1][i].buy).toFixed(2) +
        "₴*" +
        "\n\t ↘️ Sell: *\t" +
        Number(val[1][i].sale).toFixed(2) +
        "₴*"
      );
    } else return error.message;
  }
};

const getExchangeRate = async (text, i) => {
  return text + (await getMono(i))+ "\n" + (await getPrivat(i));
};

module.exports = getExchangeRate;
