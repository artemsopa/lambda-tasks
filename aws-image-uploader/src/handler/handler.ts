import AWS from 'aws-sdk';
import { APIGatewayEvent } from 'aws-lambda';
import axios from 'axios';
import AuthHandler from './auth.handler';
import BucketHandler from './bucket.handler';
import Service, { Deps } from '../service/service';
import Repository from '../repository/repository';
import { initConfigs } from '../configs/config';
import ApiError from '../models/api-error';

export class Response {
  statusCode: number;
  body: any;

  constructor(statusCode: number, body: any) {
    this.statusCode = statusCode;
    this.body = body;
  }
}

export const next = (error: unknown) => {
  if (error instanceof ApiError) {
    return new Response(error.status, JSON.stringify({ message: error.message }));
  }
  return new Response(500, JSON.stringify(error));
};

export interface IAuthHandler {
    signIn(event: APIGatewayEvent): Promise<any>;
    signUp(event: APIGatewayEvent): Promise<any>;
}

export interface IBucketHandler {
    getAllImages(event: APIGatewayEvent): Promise<any>;
    uploadImage(event: APIGatewayEvent): Promise<any>;
    deleteImage(event: APIGatewayEvent): Promise<any>;
}

class Handler {
  auth: IAuthHandler;
  bucket: IBucketHandler;

  constructor() {
    const configs = initConfigs();
    const axiosInstance = axios.create();

    const cognito = new AWS.CognitoIdentityServiceProvider();
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    const s3 = new AWS.S3();

    const deps = new Deps(
      new Repository(dynamodb, configs.dynamodb.tableName),
      cognito,
      configs.cognito.userPoolId,
      configs.cognito.userClientId,
      s3,
      configs.s3.bucketName,
      axiosInstance,
    );
    const services = new Service(deps);

    this.auth = new AuthHandler(services.auth);
    this.bucket = new BucketHandler(services.bucket);
  }
}

export default new Handler();
