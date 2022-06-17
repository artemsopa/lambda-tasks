import jwt from "jsonwebtoken"
import { ObjectId } from "mongodb";
import { JwtPlaceholder, Token, Tokens } from "../../internal/models/models";

export interface JwtManager {
    newTokens(userId: string): Tokens;
    verifyAccessToken(token: string): ObjectId | null;
}

export class AuthManager implements JwtManager {
    signingKeyAccess: string;
    signingKeyRefresh: string;
    accessTTL: string;
    refreshTTL: string;

    constructor(signingKeyAccess: string, signingKeyRefresh: string, accessTTL: string, refreshTTL: string) {
        if (signingKeyAccess == "" || signingKeyRefresh == "") {
            throw new Error("empty signing key")
        }
        this.signingKeyAccess = signingKeyAccess;
        this.signingKeyRefresh = signingKeyRefresh;
        this.accessTTL = accessTTL;
        this.refreshTTL = refreshTTL;
    }

    newTokens(userId: string): Tokens {
        const accessToken = jwt.sign({ userId }, this.signingKeyAccess, { expiresIn: this.accessTTL })
        const refreshToken = jwt.sign({ userId, expiresAt: parseTtl(this.refreshTTL) }, this.signingKeyRefresh, { expiresIn: this.refreshTTL })
        return new Tokens(
            new Token(accessToken, parseTtl(this.accessTTL)),
            new Token(refreshToken, parseTtl(this.refreshTTL))
        )
    }

    verifyAccessToken(token: string) {
        try {
            const jwtObj = jwt.verify(token, this.signingKeyAccess) as JwtPlaceholder;
            return new ObjectId(jwtObj.userId);
        } catch (error) {
            return null
        }
    }
}

function parseTtl(ttl: string): Date {
    const last = ttl[ttl.length-1];
    const num = parseInt(ttl);
    if(last == "m") {
        return new Date(Date.now() + num * 60 * 1000);
    }
    if(last == "d") {
        return new Date(Date.now() + num * 24* 60 * 60 * 1000);
    }
    return new Date();
}