import jwt from 'jsonwebtoken';
import { JwtPlaceholder, Token } from '../models/token';

export interface JwtManager {
    newToken(PK: string): Token;
    verifyAccessToken(token: string): string;
}

export class AuthManager implements JwtManager {
  signingKey: string;
  tokenTTL: number;

  constructor(signingKey: string, tokenTTL: number) {
    this.signingKey = signingKey;
    this.tokenTTL = tokenTTL;
  }

  newToken(PK: string): Token {
    const token = jwt.sign({ PK }, this.signingKey, { expiresIn: this.tokenTTL });
    return new Token(token);
  }

  verifyAccessToken(token: string) {
    const jwtObj = jwt.verify(token, this.signingKey) as JwtPlaceholder;
    return jwtObj.PK;
  }
}
