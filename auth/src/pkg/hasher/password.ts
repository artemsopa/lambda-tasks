import bcrypt from "bcrypt";

export interface PasswordHasher {
    hash(password: string): Promise<string>;
    compare(password: string, hash: string): Promise<boolean>;
}

export class BcryptHasher {
    private salt: string;

    constructor(salt: string) {
        this.salt = salt;
    }

    async hash(password: string): Promise<string> {
        return await bcrypt.hash(password, parseInt(this.salt));
    }

    async compare(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }
}
