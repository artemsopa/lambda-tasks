import { APIGatewayEvent } from 'aws-lambda';
import AuthHandler from './auth.handler';
import BucketHandler from './bucket.handler';
import AuthService from '../service/auth.service';
import BucketService from '../service/bucket.service';

export class Response {
  statusCode: number;
  body: any;

  constructor(statusCode: number, body: any) {
    this.statusCode = statusCode;
    this.body = body;
  }
}

export interface IAuthHandler {
    signIn(event: APIGatewayEvent): Promise<Response>;
    signUp(event: APIGatewayEvent): Promise<Response>;
}

export interface IBucketHandler {
    getAllImages(event: APIGatewayEvent): Promise<Response>;
    uploadImage(event: APIGatewayEvent): Promise<Response>;
    deleteImage(event: APIGatewayEvent): Promise<Response>;
}

class Handler {
  auth: IAuthHandler;
  bucket: IBucketHandler;

  constructor() {
    this.auth = new AuthHandler(new AuthService());
    this.bucket = new BucketHandler(new BucketService());
  }
}

export default new Handler();
