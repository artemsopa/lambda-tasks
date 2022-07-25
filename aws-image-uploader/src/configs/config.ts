import dotenv from 'dotenv';
import {
  CognitoConfigs, Configs, AuthConfigs, S3Configs, DynamoDBConfigs,
} from '../models/config-models';

export const initConfigs = (): Configs => {
  dotenv.config();
  const {
    USER_POOL_ID, USER_CLIENT_ID, TABLE_NAME, BUCKET_NAME, PASSWORD_SALT,
  } = process.env;

  if (!USER_POOL_ID || !USER_CLIENT_ID || !TABLE_NAME || !BUCKET_NAME || !PASSWORD_SALT) {
    throw new Error('ERROR! Invalid configs!');
  }

  return new Configs(
    new AuthConfigs(
      new CognitoConfigs(USER_POOL_ID, USER_CLIENT_ID),
      Number(PASSWORD_SALT),
    ),
    new S3Configs(BUCKET_NAME),
    new DynamoDBConfigs(TABLE_NAME),
  );
};
