import { Db } from "mongodb";
import { Users } from "./repository";

class UsersRepo implements Users {
    db: Db;
    
    constructor(db: Db) {
        this.db = db;
    }

    async create(email: string, password: string): Promise<void>{
        try {
            await this.db.collection("users").insertOne({
                email,
                password,
            });
        } catch (error) {
            console.error(error)
        }
    }

    async getByEmail(email: string): Promise<Object | undefined> {
        try {
            const user = await this.db.collection("users").findOne({ email });
            return user as Object;
        } catch (error) {
            console.error(error)
        }
    }

    async getByCredentials(email: string, password: string): Promise<Object | undefined> {
        try {
            const user = await this.db.collection("users").findOne({
                email,
                password,
            });
            return user as Object;
        } catch (error) {
            console.error(error)
        }
    }
}

export default UsersRepo;