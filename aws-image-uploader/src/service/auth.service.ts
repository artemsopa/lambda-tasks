import { IAuthService } from './service';
import { IUsersRepo } from '../respository/repository';
import { UserInput } from '../models/user';

class AuthService implements IAuthService {
  constructor(private usersRepo: IUsersRepo) {
    this.usersRepo = usersRepo;
  }

  async signIn(email: string, password: string) {
    const user = await this.usersRepo.getByCredentials(email, password);
    if (!user) {
      throw new Error('ERROR! User doesn\'t exists');
    }
    return user.PK;
  }

  async signUp(email: string, password: string, confirm: string) {
    if (password !== confirm) {
      throw new Error('ERROR! Passwords missmatch!');
    }
    const user = await this.usersRepo.getByEmail(email);
    if (user) {
      throw new Error(`ERROR! User with email '${email}' already exists!`);
    }
    await this.usersRepo.create(new UserInput(email, password));
  }
}

export default AuthService;
