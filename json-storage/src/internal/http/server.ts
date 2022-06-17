import { createServer, IncomingMessage, ServerResponse } from 'http';
import Router from './v1/router';

const newServer = (port: string, router: Router) => {
    const server = createServer((request: IncomingMessage, response: ServerResponse) => {
        router.initRoutes(request, response);
    });

    server.listen(port, () => console.log(`Server listens on port ${port}`));
}

export default newServer;