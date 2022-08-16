import dotenv from 'dotenv';

const initConfigs = () => {
  dotenv.config();
  const {
    QUEUE_NAME,
    ACCOUNT_ID,
    REGION,
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
  } = process.env;

  if (!QUEUE_NAME || !ACCOUNT_ID || !REGION || !DB_HOST || !DB_PORT || !DB_USER || !DB_PASSWORD) {
    throw new Error('ERROR! Invalid configuration');
  }

  return {
    queue: { QUEUE_NAME, ACCOUNT_ID, REGION },
    db: {
      DB_HOST, DB_PORT: Number(DB_PORT), DB_USER, DB_PASSWORD,
    },
  };
};

export default initConfigs;
