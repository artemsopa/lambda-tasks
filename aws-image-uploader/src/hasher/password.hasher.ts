import bcrypt from 'bcryptjs';

export interface PasswordHasher {
    hash(password: string): Promise<string>;
    compare(password: string, hash: string): Promise<boolean>;
}

export class BcryptHasher {
  constructor(private salt: number) {
    this.salt = salt;
  }

  async hash(password: string) {
    return await bcrypt.hash(password, this.salt);
  }

  async compare(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}
