import dotenv from 'dotenv';

class JwtConfig {
  signingKey: string;
  tokenTTL: number;
  constructor(signingKey: string, tokenTTL: number) {
    this.signingKey = signingKey;
    this.tokenTTL = tokenTTL;
  }
}

class AuthConfig {
  jwt: JwtConfig;
  passwordSalt: number;
  constructor(jwt: JwtConfig, passwordSalt: number) {
    this.jwt = jwt;
    this.passwordSalt = passwordSalt;
  }
}

export class Configs {
  tableName: string;
  bucketName: string;
  auth: AuthConfig;
  constructor(bucketName: string, tableName: string, auth: AuthConfig) {
    this.tableName = tableName;
    this.bucketName = bucketName;
    this.auth = auth;
  }
}

export const initConfigs = (): Configs => {
  dotenv.config();
  const {
    TABLE_NAME, BUCKET_NAME, SIGNING_KEY, TOKEN_TTL, PASSWORD_SALT,
  } = process.env;

  if (!TABLE_NAME || !BUCKET_NAME || !SIGNING_KEY || !TOKEN_TTL || !PASSWORD_SALT) {
    throw new Error('ERROR! Invalid configs!');
  }

  return new Configs(TABLE_NAME, BUCKET_NAME, new AuthConfig(new JwtConfig(SIGNING_KEY, Number(TOKEN_TTL)), Number(PASSWORD_SALT)));
};
