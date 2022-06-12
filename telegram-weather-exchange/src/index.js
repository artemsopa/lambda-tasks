const TelegramBot = require("node-telegram-bot-api");
const helper = require("./helper");
const texts = require("./texts");
const getWeather = require("./weather");
const getExchangeRate = require("./exchange");

const TOKEN = "5513124365:AAEPTm8ZTa-TODQiAaK4Py4XOJeFNYJtQE0";

const bot = new TelegramBot(TOKEN, { polling: true });

helper.logStart();

bot.onText(/\/start/, function (msg) {
  bot.sendMessage(helper.getChatId(msg), texts.helloText, {
    reply_markup: {
      resize_keyboard: true,
      keyboard: [[texts.weatherBText, texts.exchangeBText]],
    },
  });
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  switch (msg.text) {
    case texts.weatherBText:
      bot.sendMessage(helper.getChatId(msg), await getWeather(), {
        parse_mode: "Markdown",
      });
      break;
    case texts.exchangeBText:
      bot.sendMessage(helper.getChatId(msg), texts.currencyText, {
        reply_markup: {
          resize_keyboard: true,
          keyboard: [[texts.usdBText, texts.eurBText], [texts.backBText]],
        },
      });
      break;
    case texts.usdBText:
      bot.sendMessage(
        helper.getChatId(msg),
        await getExchangeRate(texts.usdText, 0),
        { parse_mode: "Markdown" }
      );
      break;
    case texts.eurBText:
      bot.sendMessage(
        helper.getChatId(msg),
        await getExchangeRate(texts.eurText, 1),
        { parse_mode: "Markdown" }
      );
      break;
    case texts.backBText:
      bot.sendMessage(helper.getChatId(msg), texts.chooseText, {
        reply_markup: {
          resize_keyboard: true,
          keyboard: [[texts.weatherBText, texts.exchangeBText]],
        },
      });
      break;
  }
});
