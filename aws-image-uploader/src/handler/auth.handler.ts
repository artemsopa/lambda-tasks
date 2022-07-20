import { APIGatewayEvent } from 'aws-lambda';
import { IAuthHandler, Response } from './handler';
import { IAuthService } from '../service/service';

class AuthHandler implements IAuthHandler {
  constructor(private authService: IAuthService) {
    this.authService = authService;
  }

  async signIn(event: APIGatewayEvent) {
    const { email, password } = JSON.parse(event.body || '');
    if (!email || !password) {
      return new Response(400, JSON.stringify({
        message: 'Invalid credentials!',
      }));
    }
    return new Response(200, JSON.stringify(await this.authService.signIn(email, password)));
  }

  async signUp(event: APIGatewayEvent) {
    try {
      const { email, password, confirm } = JSON.parse(event.body || '');
      if (!email || !password) {
        return new Response(400, JSON.stringify({
          message: 'Invalid credentials!',
        }));
      }
      await this.authService.signUp(email, password, confirm);
      return new Response(201, JSON.stringify({
        message: 'Successfully registered!',
      }));
    } catch (error) {
      return new Response(400, JSON.stringify({ error }));
    }
  }
}

export default AuthHandler;
