import AWS from 'aws-sdk';
import { IImagesRepo } from './repository';
import { Image, ImageItem } from '../models/image';

class ImagesRepo implements IImagesRepo {
  constructor(private client: AWS.DynamoDB.DocumentClient, private tableName: string) {
    this.client = client;
    this.tableName = tableName;
  }

  async isImageExists(PK: string, title: string): Promise<boolean> {
    const params = {
      TableName: this.tableName,
      Key: {
        PK,
        SK: `image_${title}`,
      },
    };
    const result = await this.client.get(params).promise();
    return !!result.Item;
  }

  async getAll(PK: string): Promise<ImageItem[]> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': PK,
        ':sk': 'image',
      },
    };
    const result = await this.client.query(params).promise();
    return result.Items as ImageItem[];
  }

  async getImage(PK: string, title: string): Promise<ImageItem | undefined> {
    const params = {
      TableName: this.tableName,
      Key: {
        PK,
        SK: `image_${title}`,
      },
    };
    const result = await this.client.get(params).promise();
    return result.Item as ImageItem;
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
    await this.client.put(params).promise();
  }

  async delete(PK: string, title: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        PK,
        SK: `image_${title}`,
      },
    };
    this.client.delete(params).promise();
  }
}

export default ImagesRepo;
