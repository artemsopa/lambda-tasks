import { Db, ObjectId } from "mongodb";
import { User } from "../models/models";
import { Users } from "./repository";

class UsersRepo implements Users {
    db: Db;

    constructor(db: Db) {
        this.db = db;
    }

    async getById(id: ObjectId): Promise<User | undefined> {
        return (await this.db.collection("users").findOne({
            _id: id
        })) as User;
    }

    async create(email: string, password: string): Promise<void> {
        await this.db.collection("users").insertOne({
            email,
            password,
        });
    }

    async getByEmail(email: string): Promise<User | undefined> {
        return (await this.db.collection("users").findOne({ email })) as User;
    }

    async getByCredentials(email: string, password: string): Promise<User | undefined> {
        return (await this.db.collection("users").findOne({
            email,
            password,
        })) as User;
    }
}

export default UsersRepo;