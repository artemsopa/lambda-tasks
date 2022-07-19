/* eslint-disable class-methods-use-this */
import AWS from 'aws-sdk';
import { IUsersRepo } from './repository';

class UsersRepo implements IUsersRepo {
  constructor(private db: AWS.DynamoDB.DocumentClient) {
    this.db = db;
  }
  getByCredentials() {
    return 'get user';
  }
  create() {
    return 'create user';
  }
}

export default UsersRepo;
