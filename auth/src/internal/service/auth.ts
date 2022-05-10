import { ObjectId } from "mongodb";
import { JwtManager } from "../../pkg/auth/token";
import { PasswordHasher } from "../../pkg/hasher/password";
import ApiError from "../exceptions/api-error";
import { Tokens } from "../models/models";
import { Sessions, Users } from "../repository/repository";
import UsersRepo from "../repository/users";
import { Auth } from "./service";

class AuthService implements Auth {
    private usersRepo: Users;
    private sessionsRepo: Sessions
    private hasher: PasswordHasher;
    private authManager: JwtManager;

    constructor(usersRepo: UsersRepo, sessionsRepo: Sessions, hasher: PasswordHasher, authManager: JwtManager) {
        this.usersRepo = usersRepo;
        this.sessionsRepo = sessionsRepo;
        this.hasher = hasher;
        this.authManager = authManager;
    }

    async signUp(email: string, password: string): Promise<void> {
        const user = await this.usersRepo.getByEmail(email);
        if (user) {
            throw ApiError.badRequest("user already exists");
        }
        const hashPassword = await this.hasher.hash(password);
        await this.usersRepo.create(email, hashPassword);
    }

    async login(email: string, password: string): Promise<Tokens> {
        const user = await this.usersRepo.getByEmail(email);
        if (!user) {
            throw ApiError.badRequest("incorrect email");
        }
        const isPassEquals = await this.hasher.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.badRequest("incorrect password");
        }
        const tokens: Tokens = this.authManager.newTokens(user._id.toString());
        await this.sessionsRepo.setSession(tokens.refreshToken.token, tokens.refreshToken.expiresAt, user._id);
        return tokens;
    }

    async refresh(token: string): Promise<Tokens> {
        const lastSession = await this.sessionsRepo.getLastSession(token)
        if(!lastSession) {
            throw ApiError.badRequest("invaild refresh token");
        }
        if(lastSession.expiresAt < new Date()) {
            throw ApiError.badRequest("refresh token expired");
        }
        const tokens: Tokens = this.authManager.newTokens(lastSession.userId.toString());
        await this.sessionsRepo.setSession(tokens.refreshToken.token, tokens.refreshToken.expiresAt, new ObjectId(lastSession.userId));
        return tokens;
    }
}

export default AuthService;