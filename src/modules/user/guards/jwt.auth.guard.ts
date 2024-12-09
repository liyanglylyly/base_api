import { AuthGuard } from '@nestjs/passport';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenService } from '@/modules/user/services';
import { isNil } from 'lodash';
import { ALLOW_GUEST } from '@/modules/user/constants';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    protected tokenService: TokenService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const allowGuest = this.reflector.getAllAndOverride<boolean>(ALLOW_GUEST, [
      context.getHandler(),
      context.getClass,
    ]);
    if (allowGuest) {
      return true;
    }
    const request = this.getRequest(context);
    const requestToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    if (isNil(requestToken)) {
      throw new UnauthorizedException();
    }
    const accessToken = isNil(requestToken)
      ? undefined
      : await this.tokenService.checkAccessToken(requestToken);
    if (isNil(accessToken)) {
      throw new UnauthorizedException();
    }
    try {
      await this.tokenService.verifyToken(accessToken.value);
      return (await super.canActivate(context)) as boolean;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  handleRequest(err: any, user: any, _info: Error) {
    if (err || isNil(user)) {
      if (isNil(user)) throw new UnauthorizedException();
      throw err;
    }
    return user;
  }

  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }

  getResponse(context: ExecutionContext) {
    return context.switchToHttp().getResponse();
  }
}
