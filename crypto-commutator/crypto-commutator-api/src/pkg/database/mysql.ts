import { DataSource } from 'typeorm';
import Info from '../../internal/entities/info';
import Favourite from '../../internal/entities/favourite';

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
    entities: [Info, Favourite],
    synchronize: true,
    logging: true,
  });
  await appDataSource.initialize();
  console.log('Database connection successful...');
  return appDataSource;
};

export default initDB;
