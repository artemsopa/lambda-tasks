import UsersRepo from './users.repo';
import ImagesRepo from './images.repo';

export interface IUsersRepo {
  getByCredentials(): any;
  create(): any;
}

export interface IImagesRepo {
  getAll(): any;
  create(): any;
  delete(): any;
}

export default class Repository {
  users: IUsersRepo;
  images: IImagesRepo;
  constructor() {
    this.users = new UsersRepo();
    this.images = new ImagesRepo();
  }
}
