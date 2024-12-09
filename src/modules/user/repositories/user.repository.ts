import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@/modules/database/base/repository';
import { UserEntity } from '@/modules/user/entities';
import { DataSource, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  protected _qbName = 'user';

  constructor(private datasource: DataSource) {
    super(UserEntity, datasource.createEntityManager());
  }

  buildBaseQB(): SelectQueryBuilder<UserEntity> {
    return this.createQueryBuilder(this.qbName).orderBy(
      `${this.qbName}.createdAt`,
      'DESC',
    );
  }
}
