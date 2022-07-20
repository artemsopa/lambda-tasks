import AWS from 'aws-sdk';
import UsersRepo from './users.repo';
import ImagesRepo from './images.repo';
import { User, UserInput } from '../models/user';
import { Image, ImageInput } from '../models/image';

export interface IUsersRepo {
  getByEmail(email: string): Promise<User | undefined>;
  create(user: UserInput): Promise<void>;
}

export interface IImagesRepo {
  getAll(PK: string): Promise<Image[]>;
  create(PK: string, image: ImageInput): Promise<void>;
  delete(PK: string, SK: string): Promise<void>;
}

export default class Repository {
  users: IUsersRepo;
  images: IImagesRepo;
  constructor(db: AWS.DynamoDB.DocumentClient, tableName: string) {
    this.users = new UsersRepo(db, tableName);
    this.images = new ImagesRepo(db, tableName);
  }
}
