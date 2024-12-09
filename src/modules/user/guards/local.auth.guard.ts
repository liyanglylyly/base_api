import {
  BadRequestException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { validateOrReject, ValidationError } from 'class-validator';
import { plainToClass, plainToInstance } from 'class-transformer';
import { CredentialDto } from '@/modules/user/dtos';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    try {
      await validateOrReject(plainToInstance(CredentialDto, request.body), {
        validationError: { target: false },
      });
    } catch (e) {
      const message = (e as ValidationError[])
        .map((e) => e.constraints ?? {})
        .reduce((o, n) => ({ ...o, ...n }), {});
      throw new BadRequestException(Object.values(message));
    }
    return super.canActivate(context) as boolean;
  }
}
