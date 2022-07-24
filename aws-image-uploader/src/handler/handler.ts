import AWS from 'aws-sdk';
import { APIGatewayEvent } from 'aws-lambda';
import axios from 'axios';
import AuthHandler from './auth.handler';
import BucketHandler from './bucket.handler';
import Service, {
  CognitoDeps, Deps, DynamoDBDeps, S3Deps,
} from '../service/service';
import Repository from '../respository/repository';
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

export const parseAuth = (event: APIGatewayEvent): string => {
  const { authorizer } = event.requestContext;
  if (!authorizer || !authorizer.claims || !authorizer.claims.email) {
    throw new ApiError(401, 'ERROR! Unauthorized!');
  }
  return authorizer.claims.email;
};

export const throwError = (error: unknown) => {
  if (error instanceof ApiError) {
    return new Response(error.status, JSON.stringify({ message: error.message }));
  }
  return new Response(500, JSON.stringify({ error }));
  // return new Response(500, JSON.stringify({ message: 'Internal Server Error!' }));
};

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

    const identity = new AWS.CognitoIdentityServiceProvider();
    const client = new AWS.DynamoDB.DocumentClient();
    const bucket = new AWS.S3();

    const axiosInstance = axios.create();

    const deps = new Deps(
      new CognitoDeps(identity, configs.auth.cognito.userPoolId, configs.auth.cognito.userClientId),
      new DynamoDBDeps(client, configs.dynamodb.tableName),
      new S3Deps(bucket, configs.s3.bucketName),
      new Repository(client, configs.dynamodb.tableName),
      axiosInstance,
    );
    const services = new Service(deps);

    this.auth = new AuthHandler(services.auth);
    this.bucket = new BucketHandler(services.bucket);
  }
}

export default new Handler();
