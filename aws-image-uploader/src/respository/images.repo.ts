/* eslint-disable class-methods-use-this */
import { IImagesRepo } from './repository';

class ImagesRepo implements IImagesRepo {
  getAll() {
    return 'get all images';
  }
  create() {
    return 'create image';
  }
  delete() {
    return 'delete image';
  }
}

export default ImagesRepo;
