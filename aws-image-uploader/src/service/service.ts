import AWS from 'aws-sdk';
import parser from 'lambda-multipart-parser';
import { AxiosInstance } from 'axios';
import AuthService from './auth.service';
import BucketService from './bucket.service';
import Repository from '../respository/repository';
import { Token } from '../models/token';
import { Image } from '../models/image';
import { AuthManager } from '../jwt/jwt.manager';
import { PasswordHasher } from '../hasher/password.hasher';

export interface IAuthService {
  signIn(email: string, password: string): Promise<Token>;
  signUp(email: string, password: string, confirm: string): Promise<void>;
}

export interface IBucketService {
  getAllImages(token: string): Promise<Image[]>;
  uploadImage(token: string, title: string | undefined, formData: parser.MultipartFile): Promise<void>;
  deleteImage(token: string, title: string): Promise<void>;
}

export class Deps {
  repos: Repository;
  authManager: AuthManager;
  hasher: PasswordHasher;
  bucket: AWS.S3;
  bucketName: string;
  axios: AxiosInstance;
  constructor(repos: Repository, authManager: AuthManager, hasher: PasswordHasher, bucket: AWS.S3, bucketName: string, axios: AxiosInstance) {
    this.repos = repos;
    this.authManager = authManager;
    this.hasher = hasher;
    this.bucket = bucket;
    this.bucketName = bucketName;
    this.axios = axios;
  }
}

export default class Service {
  auth: IAuthService;
  bucket: IBucketService;

  constructor(deps: Deps) {
    this.auth = new AuthService(deps.repos.users, deps.authManager, deps.hasher);
    this.bucket = new BucketService(deps.authManager, deps.bucket, deps.bucketName, deps.axios);
  }
}
