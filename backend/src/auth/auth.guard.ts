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

    const providerHeader = String(request.headers['x-provider'] || '').toLowerCase();
    const authHeader = String(request.headers['authorization'] || '');

    if (!providerHeader || !authHeader) {
      throw new UnauthorizedException('Missing provider or token');
    }

    if (providerHeader !== 'google' && providerHeader !== 'apple') {
      throw new UnauthorizedException('Unsupported provider');
    }

    const [scheme, idToken] = authHeader.split(' ');
    if (scheme?.toLowerCase() !== 'bearer' || !idToken) {
      throw new UnauthorizedException('Invalid authorization header');
    }

    const user = await this.authService.login(providerHeader as 'google' | 'apple', idToken);

    request.user = user;
    return true;
  }
}
