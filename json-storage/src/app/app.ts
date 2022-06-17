import { Configs, initConfig } from "../configs/config";
import Controller from "../internal/http/v1/controllers/controller";
import newDB from "../pkg/database/mongo";
import Repositories from "../internal/repository/repository";
import newServer from "../internal/http/server";
import { Deps, Services } from "../internal/service/service";
import Router from "../internal/http/v1/router";

export async function run() {
    const configs: Configs = initConfig();

    const db = await newDB(
        configs.mongo.user, configs.mongo.password, configs.mongo.name
    );

    const repos = new Repositories(db!)
    const services = new Services(new Deps(repos));
    const controller = new Controller(services.infos);
    const router = new Router(controller);

    newServer(configs.port, router);
}