const TelegramBot = require("node-telegram-bot-api");
const config = require("./config");
const helper = require("./helper");
const texts = require("./texts");
const getWeather = require("./weather");

const bot = new TelegramBot(config.TOKEN, { polling: true });

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
        bot.sendMessage(helper.getChatId(msg), await getWeather(), {parse_mode: 'Markdown'})
      break;
    case texts.exchangeBText:
      bot.sendMessage(helper.getChatId(msg), texts.currencyText, {
        reply_markup: {
          resize_keyboard: true,
          keyboard: [[texts.usdBText, texts.eurBText], [texts.backBText]],
        },
      });
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
