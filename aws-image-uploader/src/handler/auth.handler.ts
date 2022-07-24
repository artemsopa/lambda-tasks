import { APIGatewayEvent } from 'aws-lambda';
import { IAuthHandler, Response, next } from './handler';
import { IAuthService } from '../service/service';
import { signInSchema, signUpSchema } from '../joi-schemas/schemas.joi';

class AuthHandler implements IAuthHandler {
  constructor(private authService: IAuthService) {
    this.authService = authService;
  }

  async signIn(event: APIGatewayEvent) {
    try {
      const body = await signInSchema.validateAsync(event.body);
      return new Response(200, JSON.stringify(await this.authService.signIn(body.email, body.password)));
    } catch (error) {
      return next(error);
    }
  }

  async signUp(event: APIGatewayEvent) {
    try {
      const body = await signUpSchema.validateAsync(event.body);
      await this.authService.signUp(body.email, body.password);
      return new Response(201, JSON.stringify({ message: 'Successfully registered!' }));
    } catch (error) {
      return next(error);
    }
  }
}

export default AuthHandler;
