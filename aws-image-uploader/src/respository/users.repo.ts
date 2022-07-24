import AWS from 'aws-sdk';
import { IUsersRepo } from './repository';
import { User, UserInput } from '../models/user';

class UsersRepo implements IUsersRepo {
  constructor(private client: AWS.DynamoDB.DocumentClient, private tableName: string) {
    this.client = client;
    this.tableName = tableName;
  }

  async getByEmail(email: string): Promise<User> {
    const params = {
      TableName: this.tableName,
      Key: {
        PK: email,
        SK: 'user',
      },
      // IndexName: 'UserEmail',
      // KeyConditionExpression: 'email = :email',
      // ExpressionAttributeValues: {
      //   ':email': email,
      // },
    };
    const result = await this.client.get(params).promise();
    return result.Item as User;
  }

  async create(user: UserInput): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        PK: user.email,
        SK: 'user',
        password: user.password,
      },
    };
    await this.client.put(params).promise();
  }
}

export default UsersRepo;
