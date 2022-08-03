import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import handler from './handler/handler';

export default {
  signIn: middy(handler.auth.signIn.bind(handler.auth))
    .use(httpJsonBodyParser()),
  signUp: middy(handler.auth.signUp.bind(handler.auth))
    .use(httpJsonBodyParser()),

  getAllImages: handler.bucket.getAllImages.bind(handler.bucket),
  uploadImage: handler.bucket.uploadImage.bind(handler.bucket),
  deleteImage: handler.bucket.deleteImage.bind(handler.bucket),
};
