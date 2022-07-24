import AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { IUsersRepo } from './repository';
import { User, UserInput } from '../models/user';

class UsersRepo implements IUsersRepo {
  constructor(private client: AWS.DynamoDB.DocumentClient, private tableName: string) {
    this.client = client;
    this.tableName = tableName;
  }

  async getByEmail(email: string): Promise<User | undefined> {
    const params = {
      TableName: this.tableName,
      IndexName: 'UserEmail',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
    };
    const result = await this.client.query(params).promise();
    return result && result.Items ? result.Items[0] as User : undefined;
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
    await this.client.put(params).promise();
  }
}

export default UsersRepo;
