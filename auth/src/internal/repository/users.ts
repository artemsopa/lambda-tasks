import { Db } from "mongodb";
import { Users } from "./repository";

class UsersRepo implements Users {
    db: Db;

    constructor(db: Db) {
        this.db = db;
    }

    async create(email: string, password: string): Promise<void> {
        await this.db.collection("users").insertOne({
            email,
            password,
        });
    }

    async getByEmail(email: string): Promise<Object | undefined> {
        return (await this.db.collection("users").findOne({ email })) as Object;
    }

    async getByCredentials(email: string, password: string): Promise<Object | undefined> {
        return (await this.db.collection("users").findOne({
            email,
            password,
        })) as Object;
    }
}

export default UsersRepo;