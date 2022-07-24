import { APIGatewayEvent } from 'aws-lambda';
import parser from 'lambda-multipart-parser';
import { IBucketHandler, Response, next } from './handler';
import { IBucketService } from '../service/service';
import { contextSchema, deleteImageSchema } from '../joi-schemas/schemas.joi';
import ApiError from '../models/api-error';

class BucketHandler implements IBucketHandler {
  constructor(private bucketService: IBucketService) {
    this.bucketService = bucketService;
  }

  async getAllImages(event: APIGatewayEvent) {
    try {
      const context = await contextSchema.validateAsync(event.requestContext);
      return new Response(200, JSON.stringify(await this.bucketService.getAllImages(context.authorizer.claims.email)));
    } catch (error) {
      return next(error);
    }
  }

  async uploadImage(event: APIGatewayEvent) {
    try {
      const context = await contextSchema.validateAsync(event.requestContext);
      const title = event.queryStringParameters?.title;
      const file = await this.parseMultipart(event);
      await this.bucketService.uploadImage(context.authorizer.claims.email, title, file);
      return new Response(201, JSON.stringify({ message: 'Image successfully uploaded!' }));
    } catch (error) {
      return next(error);
    }
  }

  private async parseMultipart(event: APIGatewayEvent) {
    const file = (await parser.parse(event)).files.find((item) => item.fieldname === 'file');
    if (!file) throw new ApiError(400, 'ERROR! Cannot find file!');
    return file;
  }

  async deleteImage(event: APIGatewayEvent) {
    try {
      const context = await contextSchema.validateAsync(event.requestContext);
      const params = await deleteImageSchema.validateAsync(event.pathParameters);
      await this.bucketService.deleteImage(context.authorizer.claims.email, params.title);
      return new Response(200, JSON.stringify({ message: `Image ${params.title} sucessfully deleted!` }));
    } catch (error) {
      return next(error);
    }
  }
}

export default BucketHandler;
