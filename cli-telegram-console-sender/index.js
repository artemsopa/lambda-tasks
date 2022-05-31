const program = require('commander');
const TelegramBot = require('node-telegram-bot-api');

const token = '5576052672:AAEeaGEA2MaYoQJd_RE4mdhtg3ehjphLgc4';
const chatId = 519188303;
//@console_sender_bot
const bot = new TelegramBot(token);

program.version('1.0.0');

program
    .command('message')
    .alias('m')
    .description('Send a message to Telegram Bot')
    .argument('<message>')
    .action(message => bot.sendMessage(chatId, message));

program
    .command('photo')
    .alias('p')
    .description('Send a photo to Telegram Bot, just drag and drop it console after p-flag')
    .argument('<path>')
    .action(path => bot.sendPhoto(chatId, path));

program.parse(process.argv);
