import { ObjectId } from "mongodb";
import { Request } from 'express';

export interface User {
    _id: ObjectId;
    email: string;
    password: string;
}

export interface SessionRefresh {
    _id: ObjectId;
    token: string;
    expiresAt: Date;
    userId: ObjectId;
}

export class UserPlaceholder {
    _id: ObjectId;
    email: string;
    constructor(_id: ObjectId, email: string) {
        this._id = _id;
        this.email = email;
    }
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

export interface TokenRequest extends Request {
    token?: string;
}

export interface JwtPlaceholder {
    userId: string;
    expiresAt: Date;
}