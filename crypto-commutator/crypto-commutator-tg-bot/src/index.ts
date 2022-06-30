import dotenv from 'dotenv';
import express, { Express } from 'express';
import axios from 'axios';

dotenv.config();

const { PORT, TOKEN, SERVER_URL } = process.env;

const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const URI = `/webhook/${TOKEN}`;
const WEBHOOK_URL = SERVER_URL + URI;

const app: Express = express();
app.use(express.json());

const init = async () => {
  const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`);
  console.log(res.data);
};

app.post(URI, async (req, res) => {
  try {
    console.log(req.body);

    const chatId = req.body.message.chat.id;
    const { text } = req.body.message;

    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text,
    });

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
