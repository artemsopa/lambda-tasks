/* eslint-disable class-methods-use-this */
import AWS from 'aws-sdk';
import { IImagesRepo } from './repository';

class ImagesRepo implements IImagesRepo {
  constructor(private db: AWS.DynamoDB.DocumentClient) {
    this.db = db;
  }
  getAll() {
    return 'get all images';
  }
  create() {
    return 'create image';
  }
  delete() {
    return 'delete image';
  }
}

export default ImagesRepo;
