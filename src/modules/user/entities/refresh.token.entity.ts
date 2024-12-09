import { BaseToken } from '@/modules/user/entities/base.token';
import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { AccessTokenEntity } from '@/modules/user/entities';
import type { Relation } from 'typeorm';

@Entity('user_refresh_token')
export class RefreshTokenEntity extends BaseToken {
  @OneToOne(
    () => AccessTokenEntity,
    (accessToken) => accessToken.refreshToken,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  accessToken: Relation<AccessTokenEntity>;
}
