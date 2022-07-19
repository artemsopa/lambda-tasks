/* eslint-disable class-methods-use-this */
import { IAuthService } from './service';
import { IUsersRepo } from '../respository/repository';

class AuthService implements IAuthService {
  constructor(private usersRepo: IUsersRepo) {
    this.usersRepo = usersRepo;
  }

  signIn() {
    return this.usersRepo.getByCredentials();
  }

  signUp() {
    return this.usersRepo.create();
  }
}

export default AuthService;
