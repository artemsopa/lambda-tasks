import parser from 'lambda-multipart-parser';
import mime from 'mime';
import { IBucketService, IS3Service } from './service';
import { Image } from '../models/image';
import { IImagesRepo } from '../respository/repository';
import ApiError from '../models/api-error';

class BucketService implements IBucketService {
  constructor(private s3: IS3Service, private imagesRepo: IImagesRepo) {
    this.s3 = s3;
    this.imagesRepo = imagesRepo;
  }

  async getAllImages(PK: string) {
    return await this.s3.listObjects(PK);
  }

  async uploadImage(PK: string, title: string | undefined, file: parser.MultipartFile) {
    const contentType = await this.getImageContentType(file.contentType);
    title = title ? `${title}.${mime.getExtension(contentType)}` : file.filename;
    if (await this.imagesRepo.isImageExists(PK, title)) throw new ApiError(400, `Image with title ${title} already exists`);
    const presignedPostData = await this.s3.createPresignedPost(PK, title, contentType);
    await this.s3.uploadFileToS3(presignedPostData, file.filename, file.content);
    await this.imagesRepo.create(PK, new Image(title, `${PK}/images/${title}`, file.content.length));
  }

  private getImageContentType(contentType: string) {
    return new Promise<string>((resolve, reject) => {
      if (contentType.split('/')[0] !== 'image') {
        reject(new ApiError(400, 'Invalid Content-Type'));
      } else resolve(contentType);
    });
  }

  async deleteImage(PK: string, title: string) {
    if (await this.imagesRepo.isImageExists(PK, title)) throw new ApiError(400, `Image with title ${title} already exists`);
    await this.s3.deleteImage(PK, title);
    await this.imagesRepo.delete(PK, title);
  }
}

export default BucketService;
