import AWS from 'aws-sdk';
import { CognitoDeps, IAuthService } from './service';
import { IUsersRepo } from '../respository/repository';
import { UserInput } from '../models/user';
import { PasswordHasher } from '../hasher/password.hasher';
import ApiError from '../models/api-error';

class AuthService implements IAuthService {
  constructor(private cognito: CognitoDeps, private usersRepo: IUsersRepo, private hasher: PasswordHasher) {
    this.cognito = cognito;
    this.usersRepo = usersRepo;
    this.hasher = hasher;
  }

  async signIn(email: string, password: string) {
    const params = {
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      UserPoolId: this.cognito.userPoolId,
      ClientId: this.cognito.userClientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    };
    const response = await this.cognito.identity.adminInitiateAuth(params).promise();
    return response.AuthenticationResult?.IdToken;
    // const user = await this.usersRepo.getByEmail(email);
    // if (!user) {
    //   throw new ApiError(400, `ERROR! User with email '${email}' doesn't exist!`);
    // }
    // const isPassEquals = await this.hasher.compare(password, user.password);
    // if (!isPassEquals) {
    //   throw new ApiError(400, 'ERROR! Passwords missmatch!');
    // }
    // return this.authManager.newToken(user.PK);
  }

  async signUp(email: string, password: string, confirm: string) {
    const paramsEmail = {
      UserPoolId: this.cognito.userPoolId,
      Username: email,
      UserAttributes: [{
        Name: 'email',
        Value: email,
      },
      {
        Name: 'email_verified',
        Value: 'true',
      },
      ],
      MessageAction: 'SUPPRESS',
    };
    const response = await this.cognito.identity.adminCreateUser(paramsEmail).promise();
    if (response.User) {
      const paramsPass = {
        Password: password,
        UserPoolId: this.cognito.userPoolId,
        Username: email,
        Permanent: true,
      };
      await this.cognito.identity.adminSetUserPassword(paramsPass).promise();
    }
    // if (password !== confirm) {
    //   throw new ApiError(400, 'ERROR! Passwords missmatch!');
    // }
    // const user = await this.usersRepo.getByEmail(email);
    // if (user) {
    //   throw new ApiError(400, `ERROR! User with email '${email}' already exists!`);
    // }
    // const hash = await this.hasher.hash(password);
    // await this.usersRepo.create(new UserInput(email, hash));
  }
}

export default AuthService;
