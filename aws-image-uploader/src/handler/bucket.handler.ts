import { APIGatewayEvent } from 'aws-lambda';
import { IBucketHandler, Response } from './handler';
import { IBucketService } from '../service/service';

class BucketHandler implements IBucketHandler {
  constructor(private bucketService: IBucketService) {
    this.bucketService = bucketService;
  }

  async getAllImages(event: APIGatewayEvent) {
    const PK = event.headers.Authorization;
    if (!PK) return new Response(400, 'Unauthorized');
    return new Response(200, JSON.stringify(this.bucketService.getAllImages(PK)));
  }

  // eslint-disable-next-line class-methods-use-this
  async uploadImage(event: APIGatewayEvent): Promise<Response> {
    const PK = event.headers.Authorization;
    if (!PK) return new Response(400, 'Unauthorized');
    // return new Response(201, JSON.stringify(this.bucketService.uploadImage()));
    return new Response(201, 'Hello!');
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
