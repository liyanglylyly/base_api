import {
  EntityManager,
  EntityTarget,
  ObjectLiteral,
  QueryRunner,
  SelectQueryBuilder,
  TreeRepository,
} from 'typeorm';

export class BaseTreeRepository<
  E extends ObjectLiteral,
> extends TreeRepository<E> {
  /**
   * 构建查询时默认的模型对应的查询名称
   * */
  protected _qbName: string = 'treeEntity';

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
