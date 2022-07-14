/* eslint-disable class-methods-use-this */
import { IAuthService } from './service';

class AuthService implements IAuthService {
  signIn() {
    return 'SignIn';
  }

  signUp() {
    return 'SignUp';
  }
}

export default AuthService;
