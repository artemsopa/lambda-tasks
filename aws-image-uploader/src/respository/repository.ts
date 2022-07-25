import AWS from 'aws-sdk';
import UsersRepo from './users.repo';
import { User } from '../models/user';
import { Image, ImageItem } from '../models/image';
import ImagesRepo from './images.repo';

export interface IUsersRepo {
  getByEmail(email: string): Promise<User | undefined>;
  create(email: string): Promise<void>;
}

export interface IImagesRepo {
  getAll(PK: string): Promise<ImageItem[]>;
  getImage(PK: string, title: string): Promise<ImageItem | undefined>;
  create(PK: string, image: Image): Promise<void>;
  delete(PK: string, title: string): Promise<void>;
}

export default class Repository {
  users: IUsersRepo;
  images: IImagesRepo;
  constructor(db: AWS.DynamoDB.DocumentClient, tableName: string) {
    this.users = new UsersRepo(db, tableName);
    this.images = new ImagesRepo(db, tableName);
  }
}
