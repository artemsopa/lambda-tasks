import { Db, ObjectId } from "mongodb";
import { User } from "../models/models";
import SessionRepo from "./session";
import UsersRepo from "./users";

export interface Users {
    db: Db;
    create(email: string, password: string): Promise<void>;
    getByEmail(email: string): Promise<User | undefined>;
    getByCredentials(email: string, password: string): Promise<User | undefined>;
}

export interface Sessions {
    db: Db;
    getRefreshToken(token: string): Promise<Object | undefined>;
    setSession(token: string, expiresAt: Date, userId: ObjectId): Promise<void>;
}

class Repositories {
    users: Users;
    sessions: Sessions;

    constructor(db: Db) {
        this.users = new UsersRepo(db);
        this.sessions = new SessionRepo(db);
    }
}

export default Repositories;