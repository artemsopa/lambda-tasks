import { Db, ObjectId } from "mongodb";
import { Sessions } from "./repository";

class SessionRepo implements Sessions {
    db: Db;

    constructor(db: Db) {
        this.db = db;
    }

    async getRefreshToken(token: string): Promise<Object | undefined> {
        return (await this.db.collection("sessions").findOne({ token }) as Object);
    }

    async setSession(token: string, expiresAt: Date, userId: ObjectId): Promise<void> {
        const refreshToken = await this.db.collection("sessions").findOne({ userId });
        if (refreshToken) {
            await this.db.collection("sessions").findOneAndUpdate({ userId }, {
                $set: {
                    expiresAt,
                    token
                }
            });
        } else {
            await this.db.collection("sessions").insertOne({
                token,
                expiresAt,
                userId,
            });
        }
    }
}

export default SessionRepo;