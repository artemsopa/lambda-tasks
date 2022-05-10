import dotenv from "dotenv";

export class Configs {
    port: string;
    mongo: MongoConfig;
    auth: AuthConfig;
    constructor(port: string, mongo: MongoConfig, auth: AuthConfig) {
        this.port = port;
        this.mongo = mongo;
        this.auth = auth;
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

class AuthConfig {
    jwt: JwtConfig;
    passwordSalt: string
    constructor(jwt: JwtConfig, passwordSalt: string) {
        this.jwt = jwt;
        this.passwordSalt = passwordSalt;
    }
}

class JwtConfig {
    signingKeyAccess: string;
    signingKeyRefresh: string;
    accessTTL: string;
    refreshTTL: string;
    constructor(signingKeyAccess: string, signingKeyRefresh: string, accessTTL: string, refreshTTL: string) {
        this.signingKeyAccess = signingKeyAccess;
        this.signingKeyRefresh = signingKeyRefresh;
        this.accessTTL = accessTTL;
        this.refreshTTL = refreshTTL;
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
        ),
        new AuthConfig(
            new JwtConfig(
                process.env.SIGNING_KEY_ACCESS || "",
                process.env.SIGNING_KEY_REFRESH || "",
                process.env.ACCESS_TOKEN_TTL || "",
                process.env.REFRESH_TOKEN_TTL || ""
            ),
            process.env.PASSWORD_SALT || ""
        )
    )

}
