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
  getAllImages(PK: string): Promise<Image[]>;
  uploadImage(PK: string, image: ImageInput): Promise<void>;
  deleteImage(PK: string, SK: string): Promise<void>;
}

export class Deps {
  repos: Repository;
  authManager: AuthManager;
  hasher: PasswordHasher;
  constructor(repos: Repository, authManager: AuthManager, hasher: PasswordHasher) {
    this.repos = repos;
    this.authManager = authManager;
    this.hasher = hasher;
  }
}

export default class Service {
  auth: IAuthService;
  bucket: IBucketService;

  constructor(deps: Deps) {
    this.auth = new AuthService(deps.repos.users, deps.authManager, deps.hasher);
    this.bucket = new BucketService(deps.repos.images);
  }
}
