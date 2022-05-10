import jwt from "jsonwebtoken"
import { Token, Tokens } from "../../internal/models/models";

export interface JwtManager {
    newTokens(payload: string): Tokens;
    parse(): void;
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

    newTokens(payload: string): Tokens {
        const accessToken = jwt.sign({ payload }, this.signingKeyAccess, { expiresIn: this.accessTTL })
        const refreshToken = jwt.sign({ payload }, this.signingKeyRefresh, { expiresIn: this.refreshTTL })
        return new Tokens(
            new Token(accessToken, parseTtl(this.accessTTL)),
            new Token(refreshToken, parseTtl(this.refreshTTL))
        )
    }

    async parse() { }
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