import { JwtManager } from "../../pkg/auth/token";
import { BcryptHasher } from "../../pkg/hasher/password";
import Repositories from "../repository/repository";
import AuthService from "./auth";

export interface Auth {
    signUp(email: string, password: string): Promise<void>;
    // login(email: string, password: string): Promise<Object | undefined>;
    // refresh(token: string): Promise<Object | undefined>;
}

export class Deps {
    repos: Repositories;
    hasher: BcryptHasher;
    jwtManager: JwtManager;
    constructor(repos: Repositories, hasher: BcryptHasher, jwtManager: JwtManager) {
        this.repos = repos;
        this.hasher = hasher;
        this.jwtManager = jwtManager;
    }
}

export class Services {
    auth: Auth;
    constructor(deps: Deps) {
        this.auth = new AuthService(deps.repos.users, deps.hasher, deps.jwtManager);
    }
}