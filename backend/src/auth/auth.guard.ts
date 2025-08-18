import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const provider = request.headers['x-provider'];
    const authHeader = request.headers['authorization'];

    if (!provider || !authHeader) {
      throw new UnauthorizedException('Missing provider or token');
    }

    const [, idToken] = (authHeader as string).split(' ');

    const user = await this.authService.login(
      provider as 'google' | 'apple',
      idToken,
    );

    request.user = user;
    return true;
  }
}
