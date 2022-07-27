import dotenv from 'dotenv';

export const initConfigs = () => {
  dotenv.config();
  const {
    USER_POOL_ID, USER_POOL_CLIENT_ID, SECRET_HASH, TABLE_NAME, BUCKET_NAME,
  } = process.env;

  if (!USER_POOL_ID || !USER_POOL_CLIENT_ID || !SECRET_HASH || !TABLE_NAME || !BUCKET_NAME) {
    throw new Error('ERROR! Invalid configuration!');
  }

  return {
    cognito: {
      userPoolId: USER_POOL_ID,
      userClientId: USER_POOL_CLIENT_ID,
      secretHash: SECRET_HASH,
    },
    s3: {
      bucketName: BUCKET_NAME,
    },
    dynamodb: {
      tableName: TABLE_NAME,
    },
  };
};
