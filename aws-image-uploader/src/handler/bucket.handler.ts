import { APIGatewayEvent } from 'aws-lambda';
import parser from 'lambda-multipart-parser';
import {
  IBucketHandler, parseAuth, Response, throwError,
} from './handler';
import { IBucketService } from '../service/service';
import ApiError from '../models/api-error';

class BucketHandler implements IBucketHandler {
  constructor(private bucketService: IBucketService) {
    this.bucketService = bucketService;
  }

  async getAllImages(event: APIGatewayEvent) {
    try {
      const PK = parseAuth(event);
      return new Response(200, JSON.stringify(await this.bucketService.getAllImages(PK)));
    } catch (error) {
      return throwError(error);
    }
  }

  async uploadImage(event: APIGatewayEvent): Promise<Response> {
    try {
      const PK = parseAuth(event);
      const title = event.queryStringParameters?.title;
      const file = (await parser.parse(event)).files.find((item) => item.fieldname === 'file');
      if (!file) throw new ApiError(400, 'ERROR! Cannot find file!');
      await this.bucketService.uploadImage(PK, title, file);
      return new Response(201, JSON.stringify({ message: 'Image successfully uploaded!' }));
    } catch (error) {
      return throwError(error);
    }
  }

  async deleteImage(event: APIGatewayEvent): Promise<Response> {
    try {
      const PK = parseAuth(event);
      const title = event.pathParameters?.title;
      if (!title) throw new ApiError(401, 'ERROR! Invalid image title!');
      await this.bucketService.deleteImage(PK, title);
      return new Response(200, JSON.stringify({ message: `Image ${title} sucessfully deleted!` }));
    } catch (error) {
      return throwError(error);
    }
  }
}

export default BucketHandler;
