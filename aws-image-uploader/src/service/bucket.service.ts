/* eslint-disable class-methods-use-this */
import { ImageInput } from '../models/image';
import { IImagesRepo } from '../respository/repository';
import { IBucketService } from './service';

class BucketService implements IBucketService {
  constructor(private imagesRepo: IImagesRepo) {
    this.imagesRepo = imagesRepo;
  }

  async getAllImages(PK: string) {
    return await this.imagesRepo.getAll(PK);
  }

  async uploadImage(PK: string, image: ImageInput) {
    await this.imagesRepo.create(PK, image);
  }

  async deleteImage(PK: string, SK: string) {
    await this.imagesRepo.delete(PK, SK);
  }
}

export default BucketService;
