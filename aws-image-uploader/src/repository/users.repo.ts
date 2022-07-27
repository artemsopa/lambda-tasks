import AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { IUsersRepo } from './repository';
import { User, UserInput } from '../models/user';

class UsersRepo implements IUsersRepo {
  constructor(private client: AWS.DynamoDB.DocumentClient, private tableName: string) {
    this.client = client;
    this.tableName = tableName;
  }

  async isEmailExists(email: string): Promise<boolean> {
    const params = {
      TableName: this.tableName,
      Key: {
        PK: email,
        SK: 'email',
      },
    };
    const result = await this.client.get(params).promise();
    return !!result.Item;
  }

  async isUserNameExists(userName: string): Promise<boolean> {
    const params = {
      TableName: this.tableName,
      Key: {
        PK: userName,
        SK: 'username',
      },
    };
    const result = await this.client.get(params).promise();
    return !!result.Item;
  }

  async create(user: UserInput): Promise<void> {
    const params = {
      TransactItems: [
        {
          Put: {
            Item: {
              PK: user.userName,
              SK: 'username',
            },
            TableName: this.tableName,
          },
        },
        {
          Put: {
            Item: {
              PK: user.email,
              SK: 'email',
            },
            TableName: this.tableName,
          },
        },
        {
          Put: {
            Item: {
              PK: `user_${uuid().toString()}`,
              SK: 'user',
              username: user.userName,
              email: user.email,
              firstname: user.firstName,
              lastname: user.lastName,
            },
            TableName: this.tableName,
          },
        },
      ],
    };
    await this.client.transactWrite(params).promise();
  }
}

export default UsersRepo;
