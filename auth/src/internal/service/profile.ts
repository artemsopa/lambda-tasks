import { ObjectId } from "mongodb";
import { Users } from "../repository/repository";
import UsersRepo from "../repository/users";
import { Profile } from "./service";
import { User } from './../models/models';
import ApiError from "../exceptions/api-error";
import { JwtManager } from "../../pkg/auth/token";

class ProfileService implements Profile {
    private usersRepo: Users;
    private authManager: JwtManager;

    constructor(usersRepo: UsersRepo, authManager: JwtManager) {
        this.usersRepo = usersRepo;
        this.authManager = authManager;
    }

    async me(token: string): Promise<User> {
        const id = this.authManager.verifyAccessToken(token);
        if(!id) {
            throw ApiError.badRequest("cannot parse token");
        }
        const user = await this.usersRepo.getById(id);
        if (!user) {
            throw ApiError.badRequest("cannot find user");
        }
        return user;
    }    
}

export default ProfileService;