/* eslint-disable class-methods-use-this */
import AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { IUsersRepo } from './repository';
import { User, UserInput } from '../models/user';

class UsersRepo implements IUsersRepo {
  constructor(private db: AWS.DynamoDB.DocumentClient, private tableName: string) {
    this.db = db;
    this.tableName = tableName;
  }

  async getByEmail(email: string): Promise<User> {
    const params = {
      TableName: this.tableName,
      Key: {
        SK: 'user',
      },
      Item: {
        email,
      },
    };
    const result = await this.db.get(params).promise();
    return result.Item as User;
  }

  async getByCredentials(email: string, password: string): Promise<User> {
    const params = {
      TableName: this.tableName,
      Key: {
        SK: 'user',
      },
      Item: {
        email,
        password,
      },
    };
    const result = await this.db.get(params).promise();
    return result.Item as User;
  }

  async create(user: UserInput): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        PK: `user_${uuid().toString()}`,
        SK: 'user',
        email: user.email,
        password: user.password,
      },
    };
    await this.db.put(params).promise();
  }
}

export default UsersRepo;
