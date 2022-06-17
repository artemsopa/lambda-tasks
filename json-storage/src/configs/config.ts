import dotenv from "dotenv";

export class Configs {
    port: string;
    mongo: MongoConfig;
    constructor(port: string, mongo: MongoConfig) {
        this.port = port;
        this.mongo = mongo;
    }
}

class MongoConfig {
    user: string;
    password: string;
    name: string;
    constructor(user: string, password: string, name: string) {
        this.user = user;
        this.password = password;
        this.name = name;
    }
}

export function initConfig(): Configs {
    dotenv.config();

    return new Configs(
        process.env.PORT || "",
        new MongoConfig(
            process.env.DB_USER || "",
            process.env.DB_PASSWORD || "",
            process.env.DB_NAME || ""
        ))
}
