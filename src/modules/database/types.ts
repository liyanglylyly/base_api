import { FindTreeOptions, ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { OrderQueryType, SelectTrashMode } from '@/modules/database/constants';

export type QueryHook<Entity> = (
  qb: SelectQueryBuilder<Entity>,
) => Promise<SelectQueryBuilder<Entity>>;

/**
 * 分页原数据
 */
export interface PaginateMeta {
  /**
   * 当前页项目数量
   */
  itemCount: number;
  /**
   * 项目总数量
   */
  totalItems?: number;
  /**
   * 每页显示数量
   */
  perPage: number;
  /**
   * 总页数
   */
  totalPages?: number;
  /**
   * 当前页数
   */
  currentPage: number;
}

/**
 * 分页选项
 */
export interface PaginateOptions {
  /**
   * 当前页数
   */
  page?: number;
  /**
   * 每页显示数量
   */
  limit?: number;
}

/**
 * 分页返回数据
 */
export interface PaginateReturn<E extends ObjectLiteral> {
  meta: PaginateMeta;
  items: E[];
}

/**
 * 数据列表查询类型
 * addQuery: 用于添加额外的回调查询
 * orderBy: 用于覆盖默认的orderBy属性的自定义排序方式
 * withTrashed: 用于查询具有软删除功能的模型时把回收站中的数据也查询出来
 * onlyTrashed: 用于查询具有软删除功能的模型时只查询回收站中的数据（前提是withTrashed必须是true）
 * */
export interface QueryParams<E extends ObjectLiteral> {
  addQuery?: QueryHook<E>;
  orderBy?: OrderQueryType;
  withTrashed?: boolean;
  onlyTrashed?: boolean;
}

/**
 * 服务类数据列表查询类型
 */
export type ServiceListQueryOption<E extends ObjectLiteral> =
  | ServiceListQueryOptionWithTrashed<E>
  | ServiceListQueryOptionNotWithTrashed<E>;

/**
 * 带有软删除的服务类数据列表查询类型
 */
type ServiceListQueryOptionWithTrashed<E extends ObjectLiteral> = Omit<
  FindTreeOptions & QueryParams<E>,
  'withTrashed'
> & {
  trashed?: `${SelectTrashMode}`;
} & Record<string, any>;

/**
 * 不带软删除的服务类数据列表查询类型
 */
type ServiceListQueryOptionNotWithTrashed<E extends ObjectLiteral> = Omit<
  ServiceListQueryOptionWithTrashed<E>,
  'trashed'
>;
