import express, { Express, json, Request, Response } from 'express';
import dotenv from 'dotenv';
import getDataMap from './ip';

dotenv.config();

const FILE_PATH: string = process.env.FILE_PATH || '..\\src\\locations.CSV';

const app: Express = express();
app.use(json())
app.set('trust proxy', true)

const port = process.env.PORT || 5000;

app.get('/', async (req: Request, res: Response) => {
    res.json(await getDataMap(FILE_PATH, req.ip));
});

app.listen(port, () => {
    console.log(`Server is running at https://localhost:${port}`);
});