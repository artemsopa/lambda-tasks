import AuthService from './auth.service';
import BucketService from './bucket.service';
import Repository from '../respository/repository';

export interface IAuthService {
  signIn(): any;
  signUp(): any;
}

export interface IBucketService {
  getAllImages(): any;
  uploadImage(): any;
  deleteImage(): any;
}

export class Deps {
  repos: Repository;
  constructor(repos: Repository) {
    this.repos = repos;
  }
}

export default class Service {
  auth: IAuthService;
  bucket: IBucketService;

  constructor(deps: Deps) {
    this.auth = new AuthService(deps.repos.users);
    this.bucket = new BucketService(deps.repos.images);
  }
}
