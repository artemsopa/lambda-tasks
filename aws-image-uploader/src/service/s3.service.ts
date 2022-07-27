import AWS from 'aws-sdk';
import FormData from 'form-data';
import { AxiosInstance } from 'axios';
import { Image } from '../models/image';
import { IS3Service } from './service';
import ApiError from '../models/api-error';

class S3Service implements IS3Service {
  constructor(private bucket: AWS.S3, private bucketName: string, private axios: AxiosInstance) {
    this.bucket = new AWS.S3();
    this.bucketName = bucketName;
    this.axios = axios;
  }

  async listObjects(prefix: string) {
    const params = {
      Bucket: this.bucketName,
      Prefix: prefix,
    };
    const response = await this.bucket.listObjectsV2(params).promise();
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
      Bucket: this.bucketName,
      Expires: 900,
    };
    return this.bucket.getSignedUrl('getObject', params);
  }

  createPresignedPost(PK: string, title: string, contentType: string) {
    const params = {
      Expires: 30 * 60,
      Bucket: this.bucketName,
      Conditions: [['content-length-range', 100, 10000000]],
      Fields: {
        'Content-Type': contentType,
        key: `${PK}/images/${title}`,
      },
    };
    return new Promise<AWS.S3.PresignedPost>((resolve, reject) => {
      this.bucket.createPresignedPost(params, (err, data) => {
        if (err) {
          reject(err);
        } else resolve(data);
      });
    });
  }

  async uploadFileToS3(presignedPostData: AWS.S3.PresignedPost, title: string, buffer: Buffer) {
    const formData = new FormData();
    Object.keys(presignedPostData.fields).forEach((key) => {
      formData.append(key, presignedPostData.fields[key]);
    });
    formData.append('file', buffer, title);
    await this.axios.post(presignedPostData.url, formData, {
      headers: { ...formData.getHeaders(), 'Content-Length': buffer.byteLength * 2 },
    });
  }

  async deleteImage(prefix: string, title: string) {
    const params = {
      Bucket: this.bucketName,
      Key: `${prefix}/images/${title}`,
    };
    await this.bucket.deleteObject(params).promise();
  }
}

export default S3Service;
