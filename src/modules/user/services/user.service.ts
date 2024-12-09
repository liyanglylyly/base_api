import { Injectable } from '@nestjs/common';
import { BaseService } from '@/modules/database/base/service';
import { UserEntity } from '@/modules/user/entities';
import { UserRepository } from '@/modules/user/repositories';
import {
  CreateUserDto,
  QueryUserDto,
  UpdateUserDto,
} from '@/modules/user/dtos';
import { QueryHook } from '@/modules/database/types';
import { EntityNotFoundError, SelectQueryBuilder } from 'typeorm';
import { isNil } from 'lodash';

@Injectable()
export class UserService extends BaseService<UserEntity, UserRepository> {
  constructor(protected userRepository: UserRepository) {
    super(userRepository);
  }

  async create(data: CreateUserDto) {
    const user = (await this.userRepository.save(data, {
      reload: true,
    })) as UserEntity;
    return await this.detail(user.id);
  }

  async update(data: UpdateUserDto) {
    const updated = await this.userRepository.save(data, { reload: true });
    const user = await this.detail(updated.id);
    return await this.detail(user.id);
  }

  async findOneByCredential(
    credential: string,
    callback?: QueryHook<UserEntity>,
  ) {
    let query = this.userRepository.buildBaseQB();
    if (callback) {
      query = await callback(query);
    }
    return query
      .where('user.username = :credential', { credential })
      .orWhere('user.email = :credential', { credential })
      .orWhere('user.phone = :credential', { credential })
      .getOne();
  }

  /**
   * 根据对象条件查找用户,不存在则抛出异常
   * @param condition
   * @param callback
   */
  async findOneByCondition(
    condition: { [key: string]: any },
    callback?: QueryHook<UserEntity>,
  ) {
    let query = this.userRepository.buildBaseQB();
    if (callback) {
      query = await callback(query);
    }
    const wheres = Object.fromEntries(
      Object.entries(condition).map(([key, value]) => [key, value]),
    );
    const user = query.where(wheres).getOne();
    if (!user) {
      throw new EntityNotFoundError(
        UserEntity,
        Object.keys(condition).join(','),
      );
    }
    return user;
  }

  protected async buildListQB(
    queryBuilder: SelectQueryBuilder<UserEntity>,
    options: QueryUserDto,
    callback?: QueryHook<UserEntity>,
  ) {
    const { orderBy } = options;
    const qb = await super.buildListQB(queryBuilder, options, callback);
    if (isNil(orderBy))
      qb.orderBy(`${this.repository.qbName}.${orderBy}`, 'ASC');
    return qb;
  }
}
