import { APIGatewayEvent } from 'aws-lambda';
import parser from 'lambda-multipart-parser';
import { IBucketHandler, Response, throwError } from './handler';
import { IBucketService } from '../service/service';
import { ImageInput } from '../models/image';

class BucketHandler implements IBucketHandler {
  constructor(private bucketService: IBucketService) {
    this.bucketService = bucketService;
  }

  async getAllImages(event: APIGatewayEvent) {
    const PK = event.headers.Authorization;
    if (!PK) return new Response(400, 'Unauthorized');
    return new Response(200, JSON.stringify(this.bucketService.getAllImages(PK)));
  }

  async uploadImage(event: APIGatewayEvent): Promise<Response> {
    try {
      const token = event.headers.Authorization;
      if (!token) return new Response(400, 'Unauthorized');
      const name = event.queryStringParameters?.name;
      const file = (await parser.parse(event)).files.find((item) => item.fieldname === 'file');
      if (!file) return new Response(400, 'Cannot find file');
      await this.bucketService.uploadImage(token, name, file);
      return new Response(201, JSON.stringify({
        message: 'Image successfully uploaded!',
      }));
    } catch (error) {
      return throwError(error);
    }
  }

  async deleteImage(event: APIGatewayEvent): Promise<Response> {
    const PK = event.headers.Authorization;
    if (!PK) return new Response(400, 'Unauthorized');
    const SK = event.pathParameters?.id;
    if (!SK) return new Response(400, 'Invalid path parameter');
    return new Response(200, JSON.stringify(this.bucketService.deleteImage(PK, SK)));
  }
}

export default BucketHandler;
