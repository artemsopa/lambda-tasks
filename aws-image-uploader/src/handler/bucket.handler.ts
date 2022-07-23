import { APIGatewayEvent } from 'aws-lambda';
import parser from 'lambda-multipart-parser';
import { IBucketHandler, Response, throwError } from './handler';
import { IBucketService } from '../service/service';
import ApiError from '../models/api-error';

class BucketHandler implements IBucketHandler {
  constructor(private bucketService: IBucketService) {
    this.bucketService = bucketService;
  }

  async getAllImages(event: APIGatewayEvent) {
    try {
      const PK = event.headers.Authorization;
      if (!PK) throw new ApiError(401, 'ERROR! Unauthorized!');
      return new Response(200, JSON.stringify(await this.bucketService.getAllImages(PK)));
    } catch (error) {
      return throwError(error);
    }
  }

  async uploadImage(event: APIGatewayEvent): Promise<Response> {
    try {
      const token = event.headers.Authorization;
      if (!token) throw new ApiError(401, 'ERROR! Unauthorized!');
      const name = event.queryStringParameters?.name;
      const file = (await parser.parse(event)).files.find((item) => item.fieldname === 'file');
      if (!file) throw new ApiError(400, 'ERROR! Cannot find file!');
      await this.bucketService.uploadImage(token, name, file);
      return new Response(201, JSON.stringify({ message: 'Image successfully uploaded!' }));
    } catch (error) {
      return throwError(error);
    }
  }

  async deleteImage(event: APIGatewayEvent): Promise<Response> {
    try {
      const PK = event.headers.Authorization;
      if (!PK) throw new ApiError(401, 'ERROR! Unauthorized!');
      const title = event.pathParameters?.id;
      if (!title) throw new ApiError(401, 'ERROR! Invalid image title!');
      return new Response(200, JSON.stringify(this.bucketService.deleteImage(PK, title)));
    } catch (error) {
      return throwError(error);
    }
  }
}

export default BucketHandler;
