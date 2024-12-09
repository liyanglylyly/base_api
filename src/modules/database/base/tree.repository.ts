import {
  EntityManager,
  EntityTarget,
  FindOptionsUtils,
  FindTreeOptions,
  ObjectLiteral,
  QueryRunner,
  SelectQueryBuilder,
  TreeRepository,
  TreeRepositoryUtils,
} from 'typeorm';
import { isNil, pick, unset } from 'lodash';
import {
  OrderQueryType,
  OrderType,
  TreeChildrenResolve,
} from '@/modules/database/constants';
import { QueryParams } from '@/modules/database/types';
import { getOrderByQuery } from '@/modules/database/helpers';

export class BaseTreeRepository<
  E extends ObjectLiteral,
> extends TreeRepository<E> {
  /**
   * 构建查询时默认的模型对应的查询名称
   * */
  protected _qbName: string = 'treeEntity';

  /**
   * 删除父分类后是否提升子分类的等级
   * */
  protected _childrenResolve?: TreeChildrenResolve;

  get childrenResolve() {
    return this._childrenResolve;
  }

  /**
   * 返回查询器的名称
   * */
  get qbName() {
    return this._qbName;
  }

  constructor(
    target: EntityTarget<E>,
    manager: EntityManager,
    queryRunner?: QueryRunner,
  ) {
    super(target, manager, queryRunner);
  }

  /**
   * 构建基础查询器
   * */
  buildBaseQB(qb?: SelectQueryBuilder<E>): SelectQueryBuilder<E> {
    const queryBuilder = qb ?? this.createQueryBuilder(this.qbName);
    return queryBuilder.leftJoinAndSelect(`${this.qbName}.parent`, 'parent');
  }
}
