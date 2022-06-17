import { Db, ObjectId } from "mongodb";
import { SessionRefresh, User } from "../models/models";
import SessionRepo from "./session";
import UsersRepo from "./users";

export interface Users {
    db: Db;
    getById(id: ObjectId): Promise<User | undefined>;
    create(email: string, password: string): Promise<void>;
    getByEmail(email: string): Promise<User | undefined>;
    getByCredentials(email: string, password: string): Promise<User | undefined>;
}

export interface Sessions {
    db: Db;
    getLastSession(token: string): Promise<SessionRefresh | undefined>;
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