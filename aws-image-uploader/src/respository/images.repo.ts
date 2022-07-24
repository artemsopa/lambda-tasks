import AWS from 'aws-sdk';
// import { IImagesRepo } from './repository';
import { Image } from '../models/image';

class ImagesRepo {
  constructor(private db: AWS.DynamoDB.DocumentClient, private tableName: string) {
    this.db = db;
    this.tableName = tableName;
  }

  async getAll(PK: string): Promise<Image[]> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': PK,
        ':sk': 'image',
      },
    };
    const result = await this.db.query(params).promise();
    return result.Items as Image[];
  }

  async create(PK: string, image: Image): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        PK,
        SK: `image_${image.title}`,
        title: image.title,
        url: image.url,
        size: image.size,
      },
    };
    await this.db.put(params).promise();
  }

  async delete(PK: string, SK: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        PK,
        SK,
      },
    };
    this.db.delete(params).promise();
  }
}

export default ImagesRepo;
