import { ObjectId } from "mongodb";

export interface User {
    _id: ObjectId;
    email: string;
    password: string;
}

export class Token {
    token: string;
    expiresAt: Date;
    constructor(token: string, expiresAt: Date) {
        this.token = token;
        this.expiresAt = expiresAt;
    }
}

export class Tokens {
    accessToken: Token;
    refreshToken: Token;
    constructor(accessToken: Token, refreshToken: Token) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}