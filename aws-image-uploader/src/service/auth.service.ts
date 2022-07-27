import { IAuthService, ICognitoService } from './service';
import { IUsersRepo } from '../repository/repository';
import { UserInput } from '../models/user';
import ApiError from '../models/api-error';

class AuthService implements IAuthService {
  constructor(private cognito: ICognitoService, private usersRepo: IUsersRepo) {
    this.cognito = cognito;
    this.usersRepo = usersRepo;
  }

  async signIn(userName: string, password: string) {
    if (!await this.usersRepo.isUserNameExists(userName)) throw new ApiError(400, `User with username ${userName} does not exist`);
    return await this.cognito.initiateAuth(userName, password);
  }

  async signUp(user: UserInput) {
    if (await this.usersRepo.isUserNameExists(user.userName)) throw new ApiError(400, `User with username ${user.userName} already exists`);
    if (await this.usersRepo.isEmailExists(user.email)) throw new ApiError(400, `User with email ${user.email} already exists`);
    await this.cognito.signUp(user);
    await this.usersRepo.create(user);
  }
}

export default AuthService;
