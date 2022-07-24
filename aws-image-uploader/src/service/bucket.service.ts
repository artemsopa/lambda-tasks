import AWS from 'aws-sdk';
import parser from 'lambda-multipart-parser';
import mime from 'mime';
import FormData from 'form-data';
import { AxiosInstance } from 'axios';
import { CognitoDeps, IBucketService, S3Deps } from './service';
import { Image } from '../models/image';
import ApiError from '../models/api-error';

class BucketService implements IBucketService {
  constructor(private cognito: CognitoDeps, private s3: S3Deps, private axios: AxiosInstance) {
    this.cognito = cognito;
    this.s3 = s3;
    this.axios = axios;
  }

  async getAllImages(token: string) {
    const PK = ''; // this.authManager.verifyAccessToken(token);
    const params = {
      Bucket: this.s3.bucketName,
      Prefix: PK,
    };
    const response = await this.s3.bucket.listObjectsV2(params).promise();
    if (!response.Contents || response.Contents.length === 0) {
      return [];
    }
    return response.Contents.map((item) => {
      if (!item.Key || !item.Size) throw new ApiError(500, 'ERROR! Cannot get images data!');
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

  async uploadImage(token: string, title: string | undefined, file: parser.MultipartFile) {
    const PK = ''; // this.authManager.verifyAccessToken(token);
    const contentType = await this.getImageContentType(file.contentType);

    title = title || `${file.filename}.${mime.getExtension(contentType)}`;
    const presignedPostData = await this.createPresignedPost(PK, title, contentType);
    await this.uploadFileToS3(presignedPostData, file.filename, file.content);
  }

  private getImageContentType(contentType: string) {
    return new Promise<string>((resolve, reject) => {
      if (contentType.split('/')[0] !== 'image') {
        reject(new ApiError(400, 'ERROR! Invalid Content-Type!'));
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
      headers: { ...formData.getHeaders(), 'Content-Length': buffer.byteLength },
    });
  }

  async deleteImage(token: string, title: string) {
    const PK = ''; // this.authManager.verifyAccessToken(token);
    const params = {
      Bucket: this.s3.bucketName,
      Key: `${PK}/images/${title}`,
    };
    await this.s3.bucket.deleteObject(params).promise();
  }
}

export default BucketService;
