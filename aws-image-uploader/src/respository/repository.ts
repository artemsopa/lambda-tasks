import AWS from 'aws-sdk';
import UsersRepo from './users.repo';
import ImagesRepo from './images.repo';

export interface IUsersRepo {
  getByCredentials(): any;
  create(): any;
}

export interface IImagesRepo {
  getAll(): any;
  create(): any;
  delete(): any;
}

export default class Repository {
  users: IUsersRepo;
  images: IImagesRepo;
  constructor(db: AWS.DynamoDB.DocumentClient) {
    this.users = new UsersRepo(db);
    this.images = new ImagesRepo(db);
  }
}
