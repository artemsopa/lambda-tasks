import { JwtManager } from "../pkg/auth/token";
import { PasswordHasher } from "../pkg/hasher/password";
import { Users } from "../repository/repository";
import UsersRepo from "../repository/users";
import { Auth } from "./service";

class AuthService implements Auth {
    private usersRepo: Users;
    private hasher: PasswordHasher;
    private authManager: JwtManager;

    constructor(usersRepo: UsersRepo, hasher: PasswordHasher, authManager: JwtManager) {
        this.usersRepo = usersRepo;
        this.hasher = hasher;
        this.authManager = authManager;
    }

    async signUp(email: string, password: string): Promise<void> {
        try {
            const user = await this.usersRepo.getByEmail(email);
            if (user) {
                throw new Error("user already exists");
            }
            const hashPassword = await this.hasher.hash(password);
            await this.usersRepo.create(email, hashPassword);
        } catch (error) {
            console.error(error);
        }
    }

    // async login(email: string, password: string): Promise<Object | undefined> {
    //     try {

    //     } catch (error) {

    //     }
    // }

    // async refresh(token: string): Promise<Object | undefined> {
    //     try {

    //     } catch (error) {

    //     }
    // }
}

export default AuthService;