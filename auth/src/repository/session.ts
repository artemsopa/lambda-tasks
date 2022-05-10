import { Db, ObjectId } from "mongodb";
import { Sessions, Users } from "./repository";

class SessionRepo implements Sessions {
    db: Db;
    
    constructor(db: Db) {
        this.db = db;
    }

    async getRefreshToken(token: string): Promise<Object | undefined> {
        try {
            const refreshToken = await this.db.collection("sessions").findOne({ token });
            return refreshToken as Object;
        } catch (error) {
            console.error(error)
        }
    }

    async setSession(token: string, userId: ObjectId): Promise<void> {
        try {
            const refreshToken = await this.db.collection("sessions").findOne({ token });
            if(refreshToken) {
                await this.db.collection("sessions").findOneAndUpdate({ userId }, { $set: {
                    expiresAt: new Date(),
                    token
                }});
            } else {
                await this.db.collection("sessions").insertOne({
                    token,
                    expiresAt: new Date(),
                    userId,
                });
            }
        } catch (error) {
            console.error(error)
        }
    }
}

export default SessionRepo;