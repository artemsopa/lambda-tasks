import AuthService from './auth.service';
import BucketService from './bucket.service';

export interface IAuthService {
  signIn(): any;
  signUp(): any;
}

export interface IBucketService {
  getAllImages(): any;
  uploadImage(): any;
  deleteImage(): any;
}

export default class Service {
  auth: IAuthService;
  bucket: IBucketService;

  constructor() {
    this.auth = new AuthService();
    this.bucket = new BucketService();
  }
}
