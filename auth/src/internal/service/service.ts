import { JwtManager } from "../../pkg/auth/token";
import { BcryptHasher } from "../../pkg/hasher/password";
import { Tokens } from "../models/models";
import Repositories from "../repository/repository";
import AuthService from "./auth";

export interface Auth {
    signUp(email: string, password: string): Promise<void>;
    login(email: string, password: string): Promise<Tokens>;
    refresh(token: string): Promise<Tokens>;
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
        this.auth = new AuthService(deps.repos.users, deps.repos.sessions, deps.hasher, deps.jwtManager);
    }
}