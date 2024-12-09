import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigurationService } from '@/modules/config/services';
import { JwtPayload } from '@/modules/user/types';
import { UserRepository } from '@/modules/user/repositories';
import { instanceToInstance, instanceToPlain } from 'class-transformer';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigurationService,
    protected userRepo: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.tokenSecret,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userRepo.findOneOrFail({
      where: { id: payload.sub },
    });
    return instanceToPlain(user);
  }
}
