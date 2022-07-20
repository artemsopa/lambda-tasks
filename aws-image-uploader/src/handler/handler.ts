import AWS from 'aws-sdk';
import { APIGatewayEvent } from 'aws-lambda';
import AuthHandler from './auth.handler';
import BucketHandler from './bucket.handler';
import Service, { Deps } from '../service/service';
import Repository from '../respository/repository';
import { initConfigs } from '../configs/config';
import { AuthManager } from '../jwt/jwt.manager';
import { BcryptHasher } from '../hasher/password.hasher';

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
    const configs = initConfigs();

    const db = new AWS.DynamoDB.DocumentClient();
    const repos = new Repository(db, configs.tableName);
    const authManager = new AuthManager(configs.auth.jwt.signingKey, configs.auth.jwt.tokenTTL);
    const hasher = new BcryptHasher(configs.auth.passwordSalt);
    const deps = new Deps(repos, authManager, hasher);
    const services = new Service(deps);

    this.auth = new AuthHandler(services.auth);
    this.bucket = new BucketHandler(services.bucket);
  }
}

export default new Handler();
