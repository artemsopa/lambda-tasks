/* eslint-disable class-methods-use-this */
import { IUsersRepo } from './repository';

class UsersRepo implements IUsersRepo {
  getByCredentials() {
    return 'get user';
  }
  create() {
    return 'create user';
  }
}

export default UsersRepo;
