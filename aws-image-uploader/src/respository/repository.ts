import AWS from 'aws-sdk';
import UsersRepo from './users.repo';
import { User, UserInput } from '../models/user';

export interface IUsersRepo {
  getByEmail(email: string): Promise<User | undefined>;
  create(user: UserInput): Promise<void>;
}

export default class Repository {
  users: IUsersRepo;
  constructor(db: AWS.DynamoDB.DocumentClient, tableName: string) {
    this.users = new UsersRepo(db, tableName);
  }
}
