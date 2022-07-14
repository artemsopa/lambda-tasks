import { APIGatewayEvent } from 'aws-lambda';
import { IAuthHandler, Response } from './handler';
import { IAuthService } from '../service/service';

class AuthHandler implements IAuthHandler {
  constructor(private authService: IAuthService) {
    this.authService = authService;
  }

  async signIn(event: APIGatewayEvent) {
    if (event) console.log('Event exists');
    return new Response(200, JSON.stringify(this.authService.signIn()));
  }

  async signUp(event: APIGatewayEvent) {
    if (event) console.log('Event exists');
    return new Response(201, JSON.stringify(this.authService.signUp()));
  }
}

export default AuthHandler;
