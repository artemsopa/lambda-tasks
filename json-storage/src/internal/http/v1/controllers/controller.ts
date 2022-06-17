import { IncomingMessage, ServerResponse } from 'http';
import { BodyS, IInfoServ, InfoS } from '../../../service/service';

class Controller {
    private infoService: IInfoServ;
    constructor(infoService: IInfoServ) {
        this.infoService = infoService;
    }

    private getJSONDataFromRequestStream<T>(request: IncomingMessage): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const chunks: Uint8Array[] = [];
            request.on('data', (chunk) => {
                chunks.push(chunk);
            });
            request.on('error', error => reject(error));
            request.on('end', () => resolve(JSON.parse(Buffer.concat(chunks).toString())));
        })
    }

    async getInfoBody(request: IncomingMessage, response: ServerResponse) {
        response.setHeader('Content-Type', 'application/json');
        try {
            const queryObject = request.url || "";
            const postBody = await this.infoService.getInfo(queryObject);
            response.end(JSON.stringify(postBody));
        } catch (error) {
            response.statusCode = 404;
            response.end(JSON.stringify({
                message: 'ERROR! Invalid url parameter!'
            }));
        }
    }

    async createInfoBody(request: IncomingMessage, response: ServerResponse) {
        response.setHeader('Content-Type', 'application/json');
        try {
            const queryObject = request.url || "";
            const reqBody = await this.getJSONDataFromRequestStream<BodyS[]>(request)
            const body = await this.infoService.createInfo(new InfoS(queryObject, reqBody));
            response.end(JSON.stringify(body));
        } catch (error) {
            response.statusCode = 404;
            response.end(JSON.stringify({
                message: 'ERROR! Invalid body!'
            }));
        }
    }
}

export default Controller;