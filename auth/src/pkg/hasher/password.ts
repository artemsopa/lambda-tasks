import bcrypt from "bcrypt";

export interface PasswordHasher {
    hash(password: string): Promise<string>;
}

export class BcryptHasher {
    private salt: string;

    constructor(salt: string) {
        this.salt = salt;
    }

    async hash(password: string): Promise<string> {
        return await bcrypt.hash(password, this.salt);
    }
}
