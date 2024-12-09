import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '@/modules/user/services/user.service';
import { decrypt } from '@/modules/user/helpers';
import { RefreshTokenEntity, UserEntity } from '@/modules/user/entities';
import * as dayjs from 'dayjs';
import { TokenService } from '@/modules/user/services/token.service';
import { ExtractJwt } from 'passport-jwt';
import { RegisterDto } from '@/modules/user/dtos';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
  ) {}
  /**
   * 用户登录验证
   * @param credential
   * @param password
   */
  async validateUser(credential: string, password: string) {
    const user = await this.userService.findOneByCredential(
      credential,
      async (qb) => qb.addSelect('user.password'),
    );
    if (user && decrypt(password, user.password)) {
      return user;
    }
    return false;
  }

  /**
   * 登录用户,并生成新的token和refreshToken
   * @param user
   */
  async login(user: UserEntity) {
    const now = dayjs();
    const { accessToken } = await this.tokenService.generateAccessToken(
      user,
      now,
    );
    return accessToken.value;
  }

  /**
   * 注销登录
   * @param req
   */
  async logout(req: Request) {
    const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req as any);
    if (accessToken) {
      await this.tokenService.removeAccessToken(accessToken);
    }
    return {
      msg: 'logout success',
    };
  }

  /**
   * 登录用户后生成新的token和refreshToken
   * @param id
   */
  async createToken(id: string) {
    const now = dayjs();
    let user: UserEntity;
    try {
      user = await this.userService.detail(id);
    } catch (e) {
      throw new ForbiddenException();
    }
    return await this.tokenService.generateAccessToken(user, now);
  }
  /**
   * 使用用户名密码注册用户
   * @param data
   */
  async register(data: RegisterDto) {
    const { username, nickname, password } = data;
    const user = await this.userService.create({
      username,
      nickname,
      password,
      actived: true,
    } as any);
    return this.userService.findOneByCondition({ id: user.id });
  }

  async refresh(token: string) {
    try {
      const d = (await this.tokenService.verifyToken(token)) as { id: string };
      const { accessToken, refreshToken } = await this.createToken(d.id);
      return {
        accessToken: accessToken.value,
        refreshToken: refreshToken.value,
      };
    } catch (e) {
      await this.tokenService.removeRefreshToken(token);
      throw new UnauthorizedException();
    }
  }
}
