import { CognitoDeps, IAuthService } from './service';
import { IUsersRepo } from '../respository/repository';
import { UserInput } from '../models/user';
import ApiError from '../models/api-error';
import { Token } from '../models/token';

class AuthService implements IAuthService {
  constructor(private cognito: CognitoDeps, private usersRepo: IUsersRepo) {
    this.cognito = cognito;
    this.usersRepo = usersRepo;
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
    const token = response.AuthenticationResult?.IdToken;
    if (!token) throw new ApiError(500, 'ERROR! Cannot authorize user!');
    return new Token(token);
  }

  async signUp(email: string, password: string) {
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
    // const hash = await this.hasher.hash(password);
    // await this.usersRepo.create(new UserInput(email, hash));
  }
}

export default AuthService;
