import AWS from 'aws-sdk';
import parser from 'lambda-multipart-parser';
import { AxiosInstance } from 'axios';
import { Image } from '../models/image';
import { Token } from '../models/token';
import { UserInput } from '../models/user';
import AuthService from './auth.service';
import BucketService from './bucket.service';
import Repository from '../repository/repository';
import CognitoService from './cognito.service';
import S3Service from './s3.service';

export interface IAuthService {
  signIn(email: string, password: string): Promise<Token>;
  signUp(user: UserInput): Promise<void>;
}

export interface IBucketService {
  getAllImages(PK: string): Promise<Image[]>;
  uploadImage(PK: string, title: string | undefined, formData: parser.MultipartFile): Promise<void>;
  deleteImage(PK: string, title: string): Promise<void>;
}

export interface ICognitoService {
  initiateAuth(userName: string, password: string): Promise<Token>;
  signUp(user: UserInput): Promise<void>;
}

export interface IS3Service {
  listObjects(prefix: string): Promise<Image[]>;
  createPresignedPost(PK: string, title: string, contentType: string): Promise<AWS.S3.PresignedPost>;
  uploadFileToS3(presignedPostData: AWS.S3.PresignedPost, title: string, buffer: Buffer): Promise<void>;
  deleteImage(prefix: string, title: string): Promise<void>;
}

export class Deps {
  repos: Repository;
  cognito: ICognitoService;
  s3: IS3Service;
  axios: AxiosInstance;
  constructor(
    repos: Repository,
    cognito: AWS.CognitoIdentityServiceProvider,
    userPoolId: string,
    userClientId: string,
    secretHash: string,
    s3: AWS.S3,
    bucketName: string,
    axios: AxiosInstance,
  ) {
    this.repos = repos;
    this.cognito = new CognitoService(cognito, userPoolId, userClientId, secretHash);
    this.s3 = new S3Service(s3, bucketName, axios);
    this.axios = axios;
  }
}

export default class Service {
  auth: IAuthService;
  bucket: IBucketService;

  constructor(deps: Deps) {
    this.auth = new AuthService(deps.cognito, deps.repos.users);
    this.bucket = new BucketService(deps.s3, deps.repos.images);
  }
}
