import dotenv from 'dotenv';

export const initConfigs = () => {
  dotenv.config();
  const {
    USER_POOL_ID, USER_POOL_CLIENT_ID, TABLE_NAME, BUCKET_NAME,
  } = process.env;

  if (!USER_POOL_ID || !USER_POOL_CLIENT_ID || !TABLE_NAME || !BUCKET_NAME) {
    throw new Error('ERROR! Invalid configuration!');
  }

  return {
    cognito: {
      userPoolId: USER_POOL_ID,
      userClientId: USER_POOL_CLIENT_ID,
    },
    s3: {
      bucketName: BUCKET_NAME,
    },
    dynamodb: {
      tableName: TABLE_NAME,
    },
  };
};
