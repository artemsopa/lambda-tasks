import axios from 'axios';
import initConfig from '../configs/config';
import Repositories from '../internal/repository/repository';
import { Deps, Services, Urls } from '../internal/service/service';
import initDB from '../pkg/database/mysql';
import Server from '../internal/delivery/server';
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
      configs.urls.cm,
      configs.urls.cbCoins,
      configs.urls.cbPrices,
      configs.urls.cs,
      configs.urls.kc,
      configs.urls.cp,
    )));

    new Server(services, configs.port).initServer();
  } catch (error) {
    console.log(error);
  }
}
