import dotenv from 'dotenv';
import express, { Express } from 'express';
import axios from 'axios';
import Commutator from './commutator';

dotenv.config();

const { PORT, TOKEN, SERVER_URL, BASE_URL } = process.env;

const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const URI = `/webhook/${TOKEN}`;
const WEBHOOK_URL = SERVER_URL + URI;

const app: Express = express();
app.use(express.json());

const init = async () => {
  const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`);
  console.log(res.data);
};

const commutator = new Commutator(BASE_URL || '');

const helpText = 'You can manage bot by sending these commands:\n\n/start - start the bot\n/help - get commands list of the bot\n/list_recent - get list of recent famous cryptocurrencies\n/{currency_symbol} (/BTC) - get cryptocurrency info by past 24 hours\n\nFavourites\n/create_favourite {currency_symbol} - add cryptocurrency to favourite list\n/list_favourite - get list of favourite cryptocurrencies\n/delete_favourite {currency_symbol} - delete cryptocurrency from favourite list';

const sendMessage = async (chatId: number, text: string) => {
  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: chatId,
    text,
  });
};

app.post(URI, async (req, res) => {
  try {
    const { id, username } = req.body.message.chat;
    const text = req.body.message.text.split(' ');
    const command = text[0];
    const symbol = text[1];

    switch (command) {
      case '/start':
        await sendMessage(id, `Welcome @${username} !`);
        break;
      case '/help':
        await sendMessage(id, helpText);
        break;
      case '/list_recent':
        await sendMessage(id, await commutator.getRecent());
        break;
      case '/create_favourite':
        await sendMessage(id, await commutator.createFavourite(id, symbol));
        break;
      case '/list_favourite':
        await sendMessage(id, await commutator.getFavourites(id));
        break;
      case '/delete_favourite':
        await sendMessage(id, await commutator.deleteFavourite(id, symbol));
        break;
      default:
        if (command[0] === '/') await sendMessage(id, await commutator.getCrypto(command.slice(1)));
        else await sendMessage(id, 'Unknown command!');
    }

    return res.send();
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, async () => {
  try {
    console.log('Server is running!');
    await init();
  } catch (error) {
    console.log(error);
  }
});

// case '/BTC':
//   await axios.post(`${TELEGRAM_API}/sendMessage`, {
//     chat_id: id,
//     text: 'HELLLOOOO!',
//     reply_markup: {
//       inline_keyboard: [
//         [
//           { text: 'Inline B!', callback_data: 'hello!' },
//         ],
//       ],
//     },
//   });
//   break;
