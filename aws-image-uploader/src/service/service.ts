import AWS from 'aws-sdk';
import parser from 'lambda-multipart-parser';
import { AxiosInstance } from 'axios';
import AuthService from './auth.service';
import BucketService from './bucket.service';
import Repository from '../respository/repository';
import { Image } from '../models/image';
import { PasswordHasher } from '../hasher/password.hasher';
import { CognitoConfigs, DynamoDBConfigs, S3Configs } from '../models/config-models';

export interface IAuthService {
  signIn(email: string, password: string): Promise<string | undefined>;
  signUp(email: string, password: string, confirm: string): Promise<void>;
}

export interface IBucketService {
  getAllImages(token: string): Promise<Image[]>;
  uploadImage(token: string, title: string | undefined, formData: parser.MultipartFile): Promise<void>;
  deleteImage(token: string, title: string): Promise<void>;
}

export class CognitoDeps extends CognitoConfigs {
  identity: AWS.CognitoIdentityServiceProvider;
  constructor(identity: AWS.CognitoIdentityServiceProvider, userPoolId: string, userClientId: string) {
    super(userPoolId, userClientId);
    this.identity = identity;
  }
}

export class DynamoDBDeps extends DynamoDBConfigs {
  client: AWS.DynamoDB.DocumentClient;
  constructor(client: AWS.DynamoDB.DocumentClient, tableName: string) {
    super(tableName);
    this.client = client;
  }
}

export class S3Deps extends S3Configs {
  bucket: AWS.S3;
  constructor(bucket: AWS.S3, bucketName: string) {
    super(bucketName);
    this.bucket = bucket;
  }
}

export class Deps {
  cognito: CognitoDeps;
  dynamodb: DynamoDBDeps;
  s3: S3Deps;
  repos: Repository;
  hasher: PasswordHasher;
  axios: AxiosInstance;
  constructor(
    cognito: CognitoDeps,
    dynamodb: DynamoDBDeps,
    s3: S3Deps,
    repos: Repository,
    hasher: PasswordHasher,
    axios: AxiosInstance,
  ) {
    this.cognito = cognito;
    this.dynamodb = dynamodb;
    this.s3 = s3;
    this.repos = repos;
    this.hasher = hasher;
    this.axios = axios;
  }
}

export default class Service {
  auth: IAuthService;
  bucket: IBucketService;

  constructor(deps: Deps) {
    this.auth = new AuthService(deps.cognito, deps.repos.users, deps.hasher);
    this.bucket = new BucketService(deps.cognito, deps.s3, deps.axios);
  }
}
