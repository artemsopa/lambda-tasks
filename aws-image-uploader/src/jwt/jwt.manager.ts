import jwt from 'jsonwebtoken';
import ApiError from '../models/api-error';
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
    try {
      const jwtObj = jwt.verify(token.split(' ')[1], this.signingKey) as JwtPlaceholder;
      return jwtObj.PK;
    } catch (error) {
      throw new ApiError(401, 'ERROR! Invalid authorization token!');
    }
  }
}
