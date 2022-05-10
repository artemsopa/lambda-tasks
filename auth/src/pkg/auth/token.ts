import jwt from "jsonwebtoken"

export interface JwtManager {
    newTokens(payload: string): Object;
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

    async newTokens(payload: string) {
        const accessToken = jwt.sign(payload, this.signingKeyAccess, { expiresIn: this.accessTTL })
        const refreshToken = jwt.sign(payload, this.signingKeyRefresh, { expiresIn: this.refreshTTL })
        return {
            accessToken,
            refreshToken
        }
    }

    async parse() { }
}