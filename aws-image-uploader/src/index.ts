import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import handler from './handler/handler';

export const signIn = middy(handler.auth.signIn.bind(handler.auth))
  .use(httpJsonBodyParser());
export const signUp = middy(handler.auth.signUp.bind(handler.auth))
  .use(httpJsonBodyParser());

export const getAllImages = handler.bucket.getAllImages.bind(handler.bucket);
export const uploadImage = handler.bucket.uploadImage.bind(handler.bucket);
export const deleteImage = handler.bucket.deleteImage.bind(handler.bucket);
