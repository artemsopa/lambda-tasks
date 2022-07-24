import { APIGatewayEvent } from 'aws-lambda';
import { IAuthHandler, Response, throwError } from './handler';
import { IAuthService } from '../service/service';
import ApiError from '../models/api-error';

class AuthHandler implements IAuthHandler {
  constructor(private authService: IAuthService) {
    this.authService = authService;
  }

  async signIn(event: APIGatewayEvent) {
    try {
      const body = JSON.parse(event.body || '');
      if (!body.email || !body.password) throw new ApiError(401, 'ERROR! Invalid credentials!');
      return new Response(200, JSON.stringify(await this.authService.signIn(body.email, body.password)));
    } catch (error) {
      return throwError(error);
    }
  }

  async signUp(event: APIGatewayEvent) {
    try {
      const body = JSON.parse(event.body || '');
      if (!body.email || !body.password) throw new ApiError(400, 'ERROR! Invalid credentials!');
      await this.authService.signUp(body.email, body.password);
      return new Response(201, JSON.stringify({ message: 'Successfully registered!' }));
    } catch (error) {
      return throwError(error);
    }
  }
}

export default AuthHandler;
