import express, { Express, json, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
app.use(json())
app.set('trust proxy', true)

const port = process.env.PORT || 5000;

function getDecimalIP(ip: string) {
    return ip.split('.').reduce(function(ipInt, octet) { return (ipInt<<8) + parseInt(octet, 10)}, 0) >>> 0;
}

app.get('/', (req: Request, res: Response) => {
    res.json({
        ip: getDecimalIP(req.ip)
    });
});

app.listen(port, () => {
    console.log(`Server is running at https://localhost:${port}`);
});