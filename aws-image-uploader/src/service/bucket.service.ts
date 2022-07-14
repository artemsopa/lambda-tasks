/* eslint-disable class-methods-use-this */
import { IBucketService } from './service';

class BucketService implements IBucketService {
  getAllImages() {
    return 'GetAllImages';
  }

  uploadImage() {
    return 'UploadImage';
  }

  deleteImage() {
    return 'DeleteImage';
  }
}

export default BucketService;
