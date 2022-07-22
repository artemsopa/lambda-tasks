import AWS from 'aws-sdk';
import parser from 'lambda-multipart-parser';
import AuthService from './auth.service';
import BucketService from './bucket.service';
import Repository from '../respository/repository';
import { Image, ImageInput } from '../models/image';
import { AuthManager } from '../jwt/jwt.manager';
import { PasswordHasher } from '../hasher/password.hasher';

export interface IAuthService {
  signIn(email: string, password: string): any;
  signUp(email: string, password: string, confirm: string): any;
}

export interface IBucketService {
  getAllImages(token: string): Promise<Image[]>;
  uploadImage(token: string, name: string | undefined, formData: parser.MultipartFile): Promise<unknown>;
  deleteImage(token: string, SK: string): Promise<void>;
}

export class Deps {
  repos: Repository;
  authManager: AuthManager;
  hasher: PasswordHasher;
  bucket: AWS.S3;
  bucketName: string;
  constructor(repos: Repository, authManager: AuthManager, hasher: PasswordHasher, bucket: AWS.S3, bucketName: string) {
    this.repos = repos;
    this.authManager = authManager;
    this.hasher = hasher;
    this.bucket = bucket;
    this.bucketName = bucketName;
  }
}

export default class Service {
  auth: IAuthService;
  bucket: IBucketService;

  constructor(deps: Deps) {
    this.auth = new AuthService(deps.repos.users, deps.authManager, deps.hasher);
    this.bucket = new BucketService(deps.repos.images, deps.authManager, deps.bucket, deps.bucketName);
  }
}
