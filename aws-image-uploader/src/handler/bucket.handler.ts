import { APIGatewayEvent } from 'aws-lambda';
import { IBucketHandler, Response } from './handler';
import { IBucketService } from '../service/service';

class BucketHandler implements IBucketHandler {
  constructor(private bucketService: IBucketService) {
    this.bucketService = bucketService;
  }

  async getAllImages(event: APIGatewayEvent) {
    if (event) console.log('Event exists');
    return new Response(200, JSON.stringify(this.bucketService.getAllImages()));
  }

  async uploadImage(event: APIGatewayEvent): Promise<Response> {
    if (event) console.log('Event exists');
    return new Response(201, JSON.stringify(this.bucketService.uploadImage()));
  }
  async deleteImage(event: APIGatewayEvent): Promise<Response> {
    if (event) console.log('Event exists');
    return new Response(200, JSON.stringify(this.bucketService.deleteImage()));
  }
}

export default BucketHandler;
