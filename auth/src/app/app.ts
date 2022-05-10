import { Configs, initConfig } from "../configs/config";
import Controller from "../controllers/controller";
import { AuthManager } from "../pkg/auth/token";
import newDB from "../pkg/database/mongo";
import { BcryptHasher } from "../pkg/hasher/password";
import Repositories from "../repository/repository";
import newServer from "../server/server";
import { Deps, Services } from "../service/service";

export async function run() {
    const configs: Configs = initConfig();

    const db = await newDB(
        configs.mongo.user, configs.mongo.password, configs.mongo.name
    );

    const hasher = new BcryptHasher(configs.auth.passwordSalt);

    const authManager = new AuthManager(
        configs.auth.jwt.signingKeyAccess, 
        configs.auth.jwt.refreshTTL,
        configs.auth.jwt.accessTTL,
        configs.auth.jwt.refreshTTL
    )

    const repos = new Repositories(db!)
    const services = new Services(new Deps(repos, hasher, authManager));
    const controller = new Controller(services.auth);

    newServer(configs.port, controller);
}