import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { PaginateOptions, PaginateReturn } from '@/modules/database/types';
import { isNil } from 'lodash';
import { OrderQueryType } from '@/modules/database/constants';

/**
 * 分页函数
 * @param qb queryBuilder实例
 * @param options 分页选项
 */
export const paginate = async <E extends ObjectLiteral>(
  qb: SelectQueryBuilder<E>,
  options: PaginateOptions,
): Promise<PaginateReturn<E>> => {
  const limit = isNil(options.limit) || options.limit < 1 ? 1 : options.limit;
  const page = isNil(options.page) || options.page < 1 ? 1 : options.page;
  const start = page >= 1 ? page - 1 : 0;
  const totalItems = await qb.getCount();
  qb.take(limit).skip(start * limit);
  const items = await qb.getMany();
  const totalPages =
    totalItems % limit === 0
      ? Math.floor(totalItems / limit)
      : Math.floor(totalItems / limit) + 1;
  const remainder = totalItems % limit !== 0 ? totalItems % limit : limit;
  const itemCount = page < totalPages ? limit : remainder;
  return {
    items,
    meta: {
      totalItems,
      itemCount,
      perPage: limit,
      totalPages,
      currentPage: page,
    },
  };
};

/**
 * 为查询添加排序,默认排序规则为DESC
 * @param qb 原查询
 * @param alias 别名
 * @param orderBy 查询排序
 *
 * 当没有传入orderBy参数时直接返回传入的queryBuilder实例
 * 当orderBy是一个字符串时，默认使用DESC降序排序
 * 当orderBy是一个对象时，我们添加这个排序名称和排序规则
 * 当orderBy是一个数组时，循环添加所有排序
 */
export const getOrderByQuery = <E extends ObjectLiteral>(
  qb: SelectQueryBuilder<E>,
  alias: string,
  orderBy?: OrderQueryType,
) => {
  if (isNil(orderBy)) {
    return qb;
  }
  if (typeof orderBy === 'string') {
    return qb.orderBy(`${alias}.${orderBy}, 'DESC`);
  }
  if (Array.isArray(orderBy)) {
    for (const item of orderBy) {
      typeof item === 'string'
        ? qb.addOrderBy(`${alias}.${item}`, 'DESC')
        : qb.addOrderBy(`${alias}.${item.name}`, item.order);
    }
    return qb;
  }
  return qb.orderBy(
    `${alias}.${(orderBy as any).name}`,
    (orderBy as any).order,
  );
};
