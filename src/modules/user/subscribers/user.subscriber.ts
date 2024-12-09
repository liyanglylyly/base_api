import { EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { UserEntity } from '@/modules/user/entities';
import { randomBytes } from 'crypto';
import { encrypt } from '@/modules/user/helpers';
import { BaseSubscriber } from '@/modules/database/base/subscribe';

@EventSubscriber()
export class UserSubscriber extends BaseSubscriber<UserEntity> {
  protected entity = UserEntity;

  protected async generateUserName(
    event: InsertEvent<UserEntity>,
  ): Promise<string> {
    const username = `user_${randomBytes(4).toString('hex').slice(0, 8)}`;
    const user = await event.manager.findOne(UserEntity, {
      where: { username },
    });
    return !user ? username : this.generateUserName(event);
  }

  async beforeInsert(event: InsertEvent<UserEntity>) {
    console.log('UserEntity -> beforeInsert');
    if (!event.entity.nickname) {
      event.entity.nickname = event.entity.username;
    }
    // 自动生成唯一用户名
    if (!event.entity.username) {
      event.entity.username = await this.generateUserName(event);
    }
    // 自动生成密码
    if (!event.entity.password) {
      event.entity.password = randomBytes(11).toString('hex').slice(0, 22);
    }
    // 自动加密密码
    event.entity.password = await encrypt(event.entity.password);
  }

  async beforeUpdate(event: UpdateEvent<UserEntity>) {
    if (this.isUpdated('password', event)) {
      event.entity.password = encrypt(event.entity.password);
    }
  }
}
