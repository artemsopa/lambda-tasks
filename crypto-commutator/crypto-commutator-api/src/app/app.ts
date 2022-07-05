import axios from 'axios';
import initConfig from '../configs/config';
import Repositories from '../internal/repository/repository';
import Services, { Deps, Urls } from '../internal/service/service';
import initDB from '../pkg/database/mysql';
import Server from '../internal/delivery/server';
import startTask from '../pkg/cron/cron';
import 'reflect-metadata';

export default async function run() {
  try {
    const configs = initConfig();

    const db = await initDB(
      configs.mysql.host,
      configs.mysql.port,
      configs.mysql.user,
      configs.mysql.password,
      configs.mysql.name,
    );

    const repos = new Repositories(db);
    const services = new Services(new Deps(repos, axios.create(), new Urls(
      configs.urls.marketCap,
      configs.urls.coinBaseCoins,
      configs.urls.coinBasePrices,
      configs.urls.coinStats,
      configs.urls.kucoin,
      configs.urls.coinPaprika,
    )));

    new Server(services, configs.port).initServer();

    startTask(services);
  } catch (error) {
    console.log(error);
  }
}
