export const CUSTOM_REPOSITORY_METADATA = 'CUSTOM_REPOSITORY_METADATA';

/**
 * 软删除数据查询类型
 * */
export enum SelectTrashMode {
  /**
   * 包含已软删除和未软删除的数据（同时查询正常数据和回收站中的数据）
   * */
  ALL = 'ALL',

  /**
   * 只包含软删除的数据 （只查询回收站中的数据）
   * */
  ONLY = 'ONLY',

  /**
   * 只包含未软删除的数据 （只查询正常数据）
   * */
  NONE = 'NONE',
}

/**
 * 排序方式
 * @enum { ASC } 升序
 * @enum { DESC } 降序
 * */
export enum OrderType {
  ASC = 'ASC',
  DESC = 'DESC',
}

/**
 * 排序字段, { 字段名称: 排序方式 }
 * 如果多个值则传入数组即可
 * 排序方法不设置, 默认 DESC
 * */
export type OrderQueryType =
  | string
  | { name: string; order: `${OrderType}` }
  | Array<{ name: string; order: `${OrderType}` } | string>;

/**
 * 属性模型在删除父级后自己的处理方式
 * */
export enum TreeChildrenResolve {
  /**
   * 在删除父节点时同时删除它的子孙节点
   * */
  DELETE = 'DELETE',

  /**
   * 在删除父节点时把它的子孙节点提升一级
   * */
  UP = 'UP',

  /**
   * 在删除父节点时把它的子节点提升为顶级节点
   * */
  ROOT = 'ROOT',
}
