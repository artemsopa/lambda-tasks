import { DataSource } from 'typeorm';
import CryptoInfo from '../../internal/domain/cryptoInfo';
import CryptoFav from '../../internal/domain/cryptoFav';

const initDB = async (
  host: string,
  port: number,
  username: string,
  password: string,
  database: string,
) => {
  const appDataSource = new DataSource({
    type: 'mysql',
    host,
    port,
    username,
    password,
    database,
    entities: [CryptoInfo, CryptoFav],
    synchronize: true,
    logging: true,
  });
  await appDataSource.initialize();
  console.log('Database connection successful...');
  return appDataSource;
};

export default initDB;
