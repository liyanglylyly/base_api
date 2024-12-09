import { Entity, ManyToOne, OneToOne } from 'typeorm';
import { BaseToken } from '@/modules/user/entities/base.token';
import { UserEntity, RefreshTokenEntity } from '@/modules/user/entities';
import type { Relation } from 'typeorm';
@Entity('user_access_token')
export class AccessTokenEntity extends BaseToken {
  /**
   * 关联的刷新令牌
   */
  @OneToOne(
    () => RefreshTokenEntity,
    (refreshToken) => refreshToken.accessToken,
    {
      cascade: true,
    },
  )
  refreshToken: RefreshTokenEntity;
  /**
   * 一个用户可能使用不同的设备登录，所以用户与访问密钥间是一对多的关系
   * */
  @ManyToOne(() => UserEntity, (user) => user.accessTokens, {
    onDelete: 'CASCADE',
  })
  user: Relation<UserEntity>;
}
