import { Injectable } from '@nestjs/common';
import {
  AccessTokenEntity,
  RefreshTokenEntity,
  UserEntity,
} from '@/modules/user/entities';
import dayjs from 'dayjs';
import { FastifyReply as Response } from 'fastify';
import { v4 as uuid } from 'uuid';
import * as jwt from 'jsonwebtoken';

import { JwtPayload } from '@/modules/user/types';
import { JwtService } from '@nestjs/jwt';
import { ConfigurationService } from '@/modules/config/services';

@Injectable()
export class TokenService {
  constructor(
    protected jwtService: JwtService,
    private config: ConfigurationService,
  ) {}

  /**
   * 根据荷载签出新的AccessToken并存入数据库
   * 且自动生成新的Refresh也存入数据库
   * @param user
   * @param now
   */
  async generateAccessToken(user: UserEntity, now: dayjs.Dayjs) {
    const accessTokenPayload: JwtPayload = {
      sub: user.id,
      iat: now.unix(),
    };
    const signed = jwt.sign(accessTokenPayload, this.config.tokenSecret, {
      expiresIn: this.config.accessTokenExpired,
    });
    const accessToken = new AccessTokenEntity();
    accessToken.value = signed;
    accessToken.user = user;
    accessToken.expired_at = now
      .add(this.config.accessTokenExpired, 'second')
      .toDate();
    await accessToken.save();
    const refreshToken = await this.generateRefreshToken(accessToken, now);
    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * 生成新的RefreshToken并存入数据库
   * @param accessToken
   * @param now
   */
  async generateRefreshToken(accessToken: AccessTokenEntity, now: dayjs.Dayjs) {
    const refreshTokenPayload = {
      id: accessToken.user.id,
      uuid: uuid(),
    };
    const refreshToken = new RefreshTokenEntity();
    refreshToken.value = jwt.sign(
      refreshTokenPayload,
      this.config.tokenSecret,
      { expiresIn: this.config.refreshTokenExpired },
    );
    refreshToken.expired_at = now
      .add(this.config.refreshTokenExpired, 'second')
      .toDate();
    refreshToken.accessToken = accessToken;
    await refreshToken.save();
    return refreshToken;
  }

  /**
   * 检查accessToken是否存在
   * @param value
   */
  async checkAccessToken(value: string) {
    return AccessTokenEntity.findOne({
      where: { value },
      relations: ['user', 'refreshToken'],
    });
  }

  /**
   * 移除AccessToken且自动移除关联的RefreshToken
   * @param value
   */
  async removeAccessToken(value: string) {
    const accessToken = await AccessTokenEntity.findOne({
      where: { value },
    });
    if (accessToken) {
      await accessToken.remove();
    }
  }

  /**
   * 移除RefreshToken
   * @param value
   */
  async removeRefreshToken(value: string) {
    const refreshToken = await RefreshTokenEntity.findOne({
      where: { value },
      relations: ['accessToken'],
    });
    if (refreshToken) {
      if (refreshToken.accessToken) {
        await refreshToken.accessToken.remove();
      }
      await refreshToken.remove();
    }
  }

  /**
   * 验证Token是否正确,如果正确则返回所属用户对象
   * @param token
   */
  async verifyToken(token: string) {
    return jwt.verify(token, this.config.tokenSecret);
  }
}
