import { In, ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from '@/modules/database/base/repository';
import { BaseTreeRepository } from '@/modules/database/base/tree.repository';
import {
  PaginateOptions,
  PaginateReturn,
  QueryHook,
  ServiceListQueryOption,
} from '@/modules/database/types';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import {
  SelectTrashMode,
  TreeChildrenResolve,
} from '@/modules/database/constants';
import { paginate, treePaginate } from '@/modules/database/helpers';
import { isNil } from 'lodash';

export abstract class BaseService<
  E extends ObjectLiteral,
  R extends BaseRepository<E> | BaseTreeRepository<E>,
  P extends ServiceListQueryOption<E> = ServiceListQueryOption<E>,
> {
  protected repository: R;

  // 是否开启软删除
  protected enableTrash = false;

  protected constructor(repository: R) {
    this.repository = repository;
    if (
      !(
        this.repository instanceof BaseRepository ||
        this.repository instanceof BaseTreeRepository
      )
    ) {
      throw new Error(
        'Repository must instance of BaseRepository or BaseTreeRepository in DataService!',
      );
    }
  }

  protected async buildItemQB(
    id: string,
    qb: SelectQueryBuilder<E>,
    callback?: QueryHook<E>,
  ) {
    qb.where(`${this.repository.qbName}.id = :id`, { id });
    if (callback) {
      return callback(qb);
    }
    return qb;
  }

  async detail(id: string, callback?: QueryHook<E>): Promise<E> {
    const qb = await this.buildItemQB(
      id,
      this.repository.buildBaseQB(),
      callback,
    );
    const item = await qb.getOne();
    if (!item) {
      throw new NotFoundException(
        `${this.repository.qbName} ${id} not exists!`,
      );
    }
    return item;
  }

  /**
   * 获取查询数据列表的 QueryBuilder
   * @param qb queryBuilder实例
   * @param options 查询选项
   * @param callback 查询回调
   */
  protected async buildListQB(
    qb: SelectQueryBuilder<E>,
    options?: P,
    callback?: QueryHook<E>,
  ) {
    const { trashed } = options ?? {};
    const queryName = this.repository.qbName;
    if (
      this.enableTrash &&
      [SelectTrashMode.ALL, SelectTrashMode.ONLY].includes(trashed)
    ) {
      qb.withDeleted();
      if (trashed === SelectTrashMode.ONLY) {
        qb.where(`${queryName}.deleteAt is Not null`);
      }
    }
    if (callback) {
      return callback(qb);
    }
    return qb;
  }

  async list(options?: P, callback?: QueryHook<E>): Promise<E[]> {
    const qb = await this.buildListQB(
      this.repository.buildBaseQB(),
      options,
      callback,
    );
    return qb.getMany();
  }

  /**
   * 获取分页数据
   * @param options 分页选项
   * @param callback 回调查询
   */
  async paginate(
    options?: PaginateOptions & P,
    callback?: QueryHook<E>,
  ): Promise<PaginateReturn<E>> {
    const queryOptions = (options ?? {}) as P;
    if (this.repository instanceof BaseTreeRepository) {
      const data = await this.list(queryOptions, callback);
      return treePaginate(options, data) as PaginateReturn<E>;
    }
    const qb = await this.buildListQB(
      this.repository.buildBaseQB(),
      queryOptions,
      callback,
    );
    return paginate(qb, options);
  }

  /**
   * 批量删除数据
   */
  async delete(ids: string[], trash?: boolean) {
    let items: E[] = [];
    if (this.repository instanceof BaseTreeRepository) {
      items = await this.repository.find({
        where: { id: In(ids) as any },
        withDeleted: this.enableTrash ? true : undefined,
        relations: ['parent', 'children'],
      });
      if (this.repository.childrenResolve === TreeChildrenResolve.UP) {
        for (const item of items) {
          if (isNil(item.children) || item.children.length <= 0) continue;
          const nchildren = [...item.children].map((c) => {
            c.parent = item.parent;
            return item;
          });
          await this.repository.save(nchildren);
        }
      }
    } else {
      items = await this.repository.find({
        where: { id: In(ids) as any },
        withDeleted: this.enableTrash ? true : undefined,
      });
    }
    if (this.enableTrash && trash) {
      const directs = items.filter((item) => !isNil(item.deletedAt));
      const softs = items.filter((item) => isNil(item.deletedAt));
      return [
        ...(await this.repository.remove(directs)),
        ...(await this.repository.softRemove(softs)),
      ];
    }
    return this.repository.remove(items);
  }

  /**
   * 批量恢复回收站中的数据
   */
  async restore(ids: string[]) {
    if (!this.enableTrash) {
      throw new ForbiddenException(
        `Can not to restore ${this.repository.qbName},because trash not enabled!`,
      );
    }
    const items = await this.repository.find({
      where: { id: In(ids) as any },
      withDeleted: true,
    });
    const trasheds = items
      .filter((item) => !isNil(item))
      .map((item) => item.id);
    if (trasheds.length < 1) return [];
    await this.repository.restore(trasheds);
    const qb = await this.buildListQB(
      this.repository.buildBaseQB(),
      undefined,
      async (builder) => builder.andWhereInIds(trasheds),
    );
    return qb.getMany();
  }
}
