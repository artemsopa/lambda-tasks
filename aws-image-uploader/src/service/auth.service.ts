import { CognitoDeps, IAuthService } from './service';
import { IUsersRepo } from '../respository/repository';
import { UserInput } from '../models/user';
import { Token } from '../models/token';
import { PasswordHasher } from '../hasher/password.hasher';
import ApiError from '../models/api-error';

class AuthService implements IAuthService {
  constructor(private cognito: CognitoDeps, private usersRepo: IUsersRepo, private hasher: PasswordHasher) {
    this.cognito = cognito;
    this.usersRepo = usersRepo;
  }

  async signIn(email: string, password: string) {
    const user = await this.usersRepo.getByEmail(email);
    if (!user) throw new ApiError(400, `User with email ${email} does not exist`);
    // await this.hasher.compare(password, user.password);
    // const hash = await this.hasher.hash(password);
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
    const token = response.AuthenticationResult?.IdToken;
    if (!token) throw new ApiError(500, 'Cannot authorize user');
    return new Token(token);
  }

  async signUp(email: string, password: string, confirm: string) {
    if (password !== confirm) throw new ApiError(400, 'Passwords missmatching');
    const user = await this.usersRepo.getByEmail(email);
    if (user) throw new ApiError(400, `User with email ${email} already exists`);
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
    if (!response.User) throw new ApiError(500, `Cannot register user with email ${email}`);
    // const hash = await this.hasher.hash(password);
    const paramsPass = {
      Password: password,
      UserPoolId: this.cognito.userPoolId,
      Username: email,
      Permanent: true,
    };
    await this.cognito.identity.adminSetUserPassword(paramsPass).promise();
    await this.usersRepo.create(email);
  }
}

export default AuthService;
