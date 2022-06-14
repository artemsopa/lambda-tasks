import { createServer, IncomingMessage, ServerResponse } from 'http';
const port = 5000;

class Post {
    title: string;
    content: Body[];
    constructor(title: string, content: Body[]) {
        this.title = title;
        this.content = content;
    }
}

class Body {
    content: string;
    constructor(content: string) {
        this.content = content;
    }
}

const posts: Post[] = [
    {
        title: 'lorem',
        content: [
            {
                content: "Hello Boy!"
            }
        ]
    }
];

function getJSONDataFromRequestStream<T>(request: IncomingMessage): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        const chunks: Uint8Array[] = [];
        request.on('data', (chunk) => {
            chunks.push(chunk);
        });
        request.on('error', error => reject(error));
        request.on('end', () => resolve(JSON.parse(Buffer.concat(chunks).toString())));
    })
}

const server = createServer(async (request: IncomingMessage, response: ServerResponse) => {
    const queryObject = request.url;
    response.setHeader('Content-Type', 'application/json');
    if (queryObject && queryObject!.length > 4) {
        const postBody = posts.find(item => item.title === queryObject.slice(1));
        if (postBody) {
            if (request.method === 'GET') {
                response.end(JSON.stringify(postBody.content));
            }
            else if (request.method === 'POST') {
                const post = await getJSONDataFromRequestStream<Body>(request)
                if (post!.content) {
                    postBody.content.push(new Body(post.content));
                    response.end(JSON.stringify(postBody.content));

                } else {
                    response.statusCode = 404;
                    response.end(JSON.stringify({
                        message: 'ERROR! Invalid body!'
                    }));
                }
            } else {
                response.statusCode = 404;
                response.end(JSON.stringify({
                    message: 'ERROR! Not found!'
                }));
            }
        } else {
            response.statusCode = 404;
            response.end(JSON.stringify({
                message: 'ERROR! Cannot find matched body!'
            }));
        }
    } else {
        response.statusCode = 404;
        response.end(JSON.stringify({
            message: 'ERROR! URL parameter length lower then 5'
        }));
    }
});

server.listen(port, () => console.log(`Server listening on port ${port}`));