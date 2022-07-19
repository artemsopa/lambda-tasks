/* eslint-disable class-methods-use-this */
import { IImagesRepo } from '../respository/repository';
import { IBucketService } from './service';

class BucketService implements IBucketService {
  constructor(private imagesRepo: IImagesRepo) {
    this.imagesRepo = imagesRepo;
  }

  getAllImages() {
    return this.imagesRepo.getAll();
  }

  uploadImage() {
    return this.imagesRepo.create();
  }

  deleteImage() {
    return this.imagesRepo.delete();
  }
}

export default BucketService;
