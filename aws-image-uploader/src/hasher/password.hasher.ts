import bcrypt from 'bcryptjs';

export interface PasswordHasher {
    hash(password: string): Promise<string>;
    compare(password: string, hash: string): Promise<boolean>;
}

export class BcryptHasher {
  private salt: number;

  constructor(salt: number) {
    this.salt = salt;
  }

  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.salt);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
