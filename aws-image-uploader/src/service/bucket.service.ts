import AWS from 'aws-sdk';
import parser from 'lambda-multipart-parser';
import mime from 'mime';
import FormData from 'form-data';
import { AxiosInstance } from 'axios';
import { IBucketService, S3Deps } from './service';
import { Image } from '../models/image';
import { IImagesRepo } from '../respository/repository';
import ApiError from '../models/api-error';

class BucketService implements IBucketService {
  constructor(private imagesRepo: IImagesRepo, private s3: S3Deps, private axios: AxiosInstance) {
    this.s3 = s3;
    this.axios = axios;
  }

  async getAllImages(PK: string) {
    const params = {
      Bucket: this.s3.bucketName,
      Prefix: PK,
    };
    const response = await this.s3.bucket.listObjectsV2(params).promise();
    if (!response.Contents || response.Contents.length === 0) {
      return [];
    }
    return response.Contents.map((item) => {
      if (!item.Key || !item.Size) throw new ApiError(500, 'Cannot get images data');
      return new Image(this.getImageTitle(item.Key), this.getSignedUrl(item.Key), item.Size);
    });
  }

  private getImageTitle(title: string) {
    const parts = title.split('/');
    return parts[parts.length - 1];
  }

  private getSignedUrl(key: string) {
    const params = {
      Key: key,
      Bucket: this.s3.bucketName,
      Expires: 900,
    };
    return this.s3.bucket.getSignedUrl('getObject', params);
  }

  async uploadImage(PK: string, title: string | undefined, file: parser.MultipartFile) {
    const contentType = await this.getImageContentType(file.contentType);
    title = title ? `${title}.${mime.getExtension(contentType)}` : file.filename;
    const image = await this.imagesRepo.getImage(PK, title);
    if (image) throw new ApiError(400, `Image ${title} already exist in your bucket`);
    const presignedPostData = await this.createPresignedPost(PK, title, contentType);
    await this.uploadFileToS3(presignedPostData, file.filename, file.content);
    await this.imagesRepo.create(PK, new Image(title, `${PK}/images/${title}`, file.content.length));
  }

  private getImageContentType(contentType: string) {
    return new Promise<string>((resolve, reject) => {
      if (contentType.split('/')[0] !== 'image') {
        reject(new ApiError(400, 'Invalid Content-Type'));
      } else resolve(contentType);
    });
  }

  private createPresignedPost(PK: string, title: string, contentType: string) {
    const params = {
      Expires: 30 * 60,
      Bucket: this.s3.bucketName,
      Conditions: [['content-length-range', 100, 10000000]],
      Fields: {
        'Content-Type': contentType,
        key: `${PK}/images/${title}`,
      },
    };
    return new Promise<AWS.S3.PresignedPost>((resolve, reject) => {
      this.s3.bucket.createPresignedPost(params, (err, data) => {
        if (err) {
          reject(err);
        } else resolve(data);
      });
    });
  }

  private async uploadFileToS3(presignedPostData: AWS.S3.PresignedPost, title: string, buffer: Buffer) {
    const formData = new FormData();
    Object.keys(presignedPostData.fields).forEach((key) => {
      formData.append(key, presignedPostData.fields[key]);
    });
    formData.append('file', buffer, title);
    await this.axios.post(presignedPostData.url, formData, {
      headers: { ...formData.getHeaders(), 'Content-Length': buffer.byteLength * 2 },
    });
  }

  async deleteImage(PK: string, title: string) {
    const image = await this.imagesRepo.getImage(PK, title);
    if (!image) throw new ApiError(400, `Image ${title} does not exist in your bucket`);
    const params = {
      Bucket: this.s3.bucketName,
      Key: `${PK}/images/${title}`,
    };
    await this.s3.bucket.deleteObject(params).promise();
    await this.imagesRepo.delete(PK, title);
  }
}

export default BucketService;
