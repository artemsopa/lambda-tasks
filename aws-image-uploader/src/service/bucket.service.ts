import AWS from 'aws-sdk';
import parser from 'lambda-multipart-parser';
import mime from 'mime';
import FormData from 'form-data';
import axios from 'axios';
import { AuthManager } from '../jwt/jwt.manager';
import ApiError from '../models/api-error';
import { ImageInput } from '../models/image';
import { IImagesRepo } from '../respository/repository';
import { IBucketService } from './service';

class BucketService implements IBucketService {
  constructor(private imagesRepo: IImagesRepo, private authManager: AuthManager, private bucket: AWS.S3, private bucketName: string) {
    this.imagesRepo = imagesRepo;
    this.authManager = authManager;
    this.bucket = bucket;
    this.bucketName = bucketName;
  }

  async getAllImages(token: string) {
    return await this.imagesRepo.getAll(token);
  }

  async uploadImage(token: string, name: string | undefined, file: parser.MultipartFile) {
    const PK = this.authManager.verifyAccessToken(token);

    if (file.contentType.split('/')[0] !== 'image') throw new ApiError(400, 'ERROR! Invalid Content-Type!');

    if (!name) name = file.filename;
    else name += `.${mime.getExtension(file.contentType)}`;

    const presignedPostData = await this.createPresignedPost(`${PK}/images/${name}`, file.contentType);
    await this.uploadFileToS3(presignedPostData, file);
  }

  async deleteImage(token: string, SK: string) {
    await this.imagesRepo.delete(token, SK);
  }

  private createPresignedPost(key: string, contentType: string) {
    const params = {
      Expires: 30 * 60,
      Bucket: this.bucketName,
      Conditions: [['content-length-range', 100, 10000000]],
      Fields: {
        'Content-Type': contentType,
        key,
      },
    };
    return new Promise<AWS.S3.PresignedPost>((resolve, reject) => {
      this.bucket.createPresignedPost(params, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      });
    });
  }

  private async uploadFileToS3(presignedPostData: AWS.S3.PresignedPost, file: parser.MultipartFile) {
    const formData = new FormData();
    Object.keys(presignedPostData.fields).forEach((key) => {
      formData.append(key, presignedPostData.fields[key]);
    });
    console.log(file.content.buffer.byteLength);
    formData.append('file', file.content, file.filename);
    await axios.post(presignedPostData.url, formData, {
      headers: { ...formData.getHeaders(), 'Content-Length': file.content.buffer.byteLength + 10000 },
    });
  }
}

export default BucketService;
