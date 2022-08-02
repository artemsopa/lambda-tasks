import dotenv from 'dotenv';

const initConfigs = () => {
  dotenv.config();
  const {
    QUEUE_NAME, ACCOUNT_ID, REGION,
  } = process.env;

  if (!QUEUE_NAME || !ACCOUNT_ID || !REGION) {
    throw new Error('ERROR! Invalid configuration');
  }

  return { QUEUE_NAME, ACCOUNT_ID, REGION };
};

export default initConfigs;
