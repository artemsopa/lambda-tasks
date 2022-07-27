import AWS from 'aws-sdk';
import UsersRepo from './users.repo';
import { User, UserInput } from '../models/user';
import { Image, ImageItem } from '../models/image';
import ImagesRepo from './images.repo';

export interface IUsersRepo {
  isEmailExists(email: string): Promise<boolean>;
  isUserNameExists(userName: string): Promise<boolean>
  create(user: UserInput): Promise<void>;
}

export interface IImagesRepo {
  isImageExists(PK: string, title: string): Promise<boolean>;
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
