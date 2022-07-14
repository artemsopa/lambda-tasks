import middy from '@middy/core';
import handler from './handler/handler';

export const signIn = middy(handler.auth.signIn.bind(handler.auth));
export const signUp = middy(handler.auth.signUp.bind(handler.auth));

export const getAllImages = middy(handler.bucket.getAllImages.bind(handler.bucket));
export const uploadImage = middy(handler.bucket.uploadImage.bind(handler.bucket));
export const deleteImage = middy(handler.bucket.deleteImage.bind(handler.bucket));
