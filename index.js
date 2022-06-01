process.env.NTBA_FIX_319 = 1;

const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");

const token = "5584520652:AAHBBaFCWPQm6s5hBTAnN0y-uHl5vwDoqzA";
// @tg1_echo_bot
const bot = new TelegramBot(token, { polling: true });

console.log(`Telegram bot successfully started...`);

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const user = msg.chat.first_name ? msg.chat?.last_name ? msg.chat?.first_name + " " + msg.chat?.last_name : msg.chat.first_name : msg.chat.username;
  if (msg.text === "photo") {
    try {
      console.log(`Пользователь ${user} запросил картинку`);

      const buffer = await downloadImage();
      await bot.sendPhoto(chatId, buffer, {}, { filename: "data", contentType: "application/octet-stream" });
    } catch (error) {
      console.log("ERROR! Cannot get picture!");
    }
  } else {
    console.log(`Пользователь ${user} написал: ${msg.text}`);
    bot.sendMessage(chatId, `Вы написали: "${msg.text}"`);
  }
});

const downloadImage = async () => {
  const response = await axios("https://picsum.photos/200/300", {
    responseType: "arraybuffer",
  });
  return response.data;
};
