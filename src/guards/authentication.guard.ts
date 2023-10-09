import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';

declare module 'express' {
  interface Request {
    user?: User;
  }
}

export class AuthenticationGuard implements CanActivate {
  constructor(@Inject(JwtService) private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization)
      throw new UnauthorizedException({
        status: 403,
        error: 'access denied',
      });

    const token = request.headers.authorization.split(' ')[1];

    if (!token)
      throw new UnauthorizedException({
        status: 403,
        error: 'access denied',
      });

    const payload = await this.jwtService.verifyAsync(token);
    request['user'] = payload;

    return true;
  }
}
