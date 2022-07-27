import AWS from 'aws-sdk';
import crypto from 'crypto';
import ApiError from '../models/api-error';
import { Token } from '../models/token';
import { UserInput } from '../models/user';

class CognitoService {
  constructor(
    private identity: AWS.CognitoIdentityServiceProvider,
    private userPoolId: string,
    private userClientId: string,
    private secretHash: string,
  ) {
    this.identity = identity;
    this.userPoolId = userPoolId;
    this.userClientId = userClientId;
    this.secretHash = secretHash;
  }

  async initiateAuth(userName: string, password: string) {
    const params = {
      UserPoolId: this.userPoolId,
      ClientId: this.userClientId,
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      AuthParameters: {
        USERNAME: userName,
        PASSWORD: password,
      },
    };
    const response = await this.identity.adminInitiateAuth(params).promise();
    const token = response.AuthenticationResult?.IdToken;
    if (!token) throw new ApiError(500, 'Cannot authorize user');
    return new Token(token);
  }

  async signUp(user: UserInput) {
    const paramsCreateUser = {
      UserPoolId: this.userPoolId,
      Username: user.userName,
      UserAttributes: [
        { Name: 'name', Value: user.firstName },
        { Name: 'family_name', Value: user.lastName },
        { Name: 'email', Value: user.email },
        { Name: 'email_verified', Value: 'true' },
      ],
    };
    const response = await this.identity.adminCreateUser(paramsCreateUser).promise();
    if (!response.User) throw new ApiError(500, `Cannot register user with email ${user.email}`);
    const paramsSetPassword = {
      UserPoolId: this.userPoolId,
      Username: user.userName,
      Password: user.password,
      Permanent: true,
    };
    await this.identity.adminSetUserPassword(paramsSetPassword).promise();
  }
}

export default CognitoService;
