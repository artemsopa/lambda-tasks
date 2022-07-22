import { IAuthService } from './service';
import { IUsersRepo } from '../respository/repository';
import { UserInput } from '../models/user';
import { AuthManager } from '../jwt/jwt.manager';
import { PasswordHasher } from '../hasher/password.hasher';
import ApiError from '../models/api-error';

class AuthService implements IAuthService {
  constructor(private usersRepo: IUsersRepo, private authManager: AuthManager, private hasher: PasswordHasher) {
    this.usersRepo = usersRepo;
    this.authManager = authManager;
    this.hasher = hasher;
  }

  async signIn(email: string, password: string) {
    const user = await this.usersRepo.getByEmail(email);
    if (!user) {
      throw new ApiError(400, `ERROR! User with email '${email}' doesn't exist!`);
    }
    const isPassEquals = await this.hasher.compare(password, user.password);
    if (!isPassEquals) {
      throw new ApiError(400, 'ERROR! Passwords missmatch!');
    }
    return this.authManager.newToken(user.PK);
  }

  async signUp(email: string, password: string, confirm: string) {
    if (password !== confirm) {
      throw new ApiError(400, 'ERROR! Passwords missmatch!');
    }
    const user = await this.usersRepo.getByEmail(email);
    if (user) {
      throw new ApiError(400, `ERROR! User with email '${email}' already exists!`);
    }
    const hash = await this.hasher.hash(password);
    await this.usersRepo.create(new UserInput(email, hash));
  }
}

export default AuthService;
