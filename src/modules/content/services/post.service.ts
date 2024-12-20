import { Injectable } from '@nestjs/common';
import {
  CategoryRepository,
  PostRepository,
  TagRepository,
} from '@/modules/content/repositories';
import { PaginateOptions, QueryHook } from '@/modules/database/types';
import { PostEntity } from '@/modules/content/entities';
import { isArray, isFunction, isNil, omit } from 'lodash';
import {
  EntityNotFoundError,
  In,
  IsNull,
  Not,
  SelectQueryBuilder,
} from 'typeorm';
import { PostOrderType } from '@/modules/content/constants';
import { paginate } from '@/modules/database/helpers';
import {
  CreatePostDto,
  QueryPostDto,
  UpdatePostDto,
} from '@/modules/content/dtos';
import { CategoryService } from '@/modules/content/services/category.service';

// 文章查询接口
type FindParams = {
  [key in keyof Omit<QueryPostDto, 'limit' | 'page'>]: QueryPostDto[key];
};

@Injectable()
export class PostService {
  constructor(
    protected repository: PostRepository,
    protected categoryRepository: CategoryRepository,
    protected categoryService: CategoryService,
    protected tagRepository: TagRepository,
  ) {}

  /**
   * 获取分页数据
   * @param options 分页选项
   * @param callback 添加额外的查询
   */
  async paginate(options: PaginateOptions, callback?: QueryHook<PostEntity>) {
    const qb = await this.buildListQuery(
      this.repository.buildBaseQB(),
      options,
      callback,
    );
    return paginate(qb, options);
  }

  /**
   * 查询单篇文章
   * @param id
   * @param callback 添加额外的查询
   */
  async detail(id: string, callback?: QueryHook<PostEntity>) {
    let qb = this.repository.buildBaseQB();
    qb.where(`post.id = :id`, { id });
    qb = !isNil(callback) && isFunction(callback) ? await callback(qb) : qb;
    const item = await qb.getOne();
    if (!item)
      throw new EntityNotFoundError(PostEntity, `The post ${id} not exists!`);
    return item;
  }

  /**
   * 创建文章
   * @param data
   */
  async create(data: CreatePostDto) {
    let publishedAt: Date | null;
    if (!isNil(data.publish)) {
      publishedAt = data.publish ? new Date() : null;
    }
    const createPostDto = {
      ...omit(data, ['publish']),
      // 文章所属的分类
      category: !isNil(data.category)
        ? await this.categoryRepository.findOneOrFail({
            where: { id: data.category },
          })
        : null,
      // 文章关联的标签
      tags: isArray(data.tags)
        ? await this.tagRepository.findBy({
            id: In(data.tags),
          })
        : [],
      publishedAt,
    };
    const item = await this.repository.save(createPostDto);

    return this.detail(item.id);
  }

  /**
   * 更新文章
   * @param data
   */
  async update(data: UpdatePostDto) {
    let publishedAt: Date | null;
    if (!isNil(data.publish)) {
      publishedAt = data.publish ? new Date() : null;
    }
    const post = await this.detail(data.id);
    if (data.category !== undefined) {
      // 更新分类
      post.category = isNil(data.category)
        ? null
        : await this.categoryRepository.findOneByOrFail({ id: data.category });
      await this.repository.save(post, { reload: true });
    }
    if (isArray(data.tags)) {
      // 更新文章关联标签
      await this.repository
        .createQueryBuilder('post')
        .relation(PostEntity, 'tags')
        .of(post)
        .addAndRemove(data.tags, post.tags ?? []);
    }
    await this.repository.update(data.id, {
      ...omit(data, ['id', 'tags', 'category', 'publish']),
      publishedAt,
    });
    return this.detail(data.id);
  }

  /**
   * 删除文章
   * @param id
   */
  async delete(id: string) {
    const item = await this.repository.findOneByOrFail({ id });
    return this.repository.remove(item);
  }

  /**
   * 构建文章列表查询器
   * @param qb 初始查询构造器
   * @param options 排查分页选项后的查询选项
   * @param callback 添加额外的查询
   */
  protected async buildListQuery(
    qb: SelectQueryBuilder<PostEntity>,
    options: Record<string, any>,
    callback?: QueryHook<PostEntity>,
  ) {
    const { category, tag, orderBy, isPublished } = options;
    if (typeof isPublished === 'boolean') {
      isPublished
        ? qb.where({
            publishedAt: Not(IsNull()),
          })
        : qb.where({
            publishedAt: IsNull(),
          });
    }
    this.queryOrderBy(qb, orderBy);
    if (category) await this.queryByCategory(category, qb);
    // 查询某个标签关联的文章
    if (tag) qb.where('tags.id = :id', { id: tag });
    if (callback) return callback(qb);
    return qb;
  }

  /**
   *  对文章进行排序的Query构建
   * @param qb
   * @param orderBy 排序方式
   */
  protected queryOrderBy(
    qb: SelectQueryBuilder<PostEntity>,
    orderBy?: PostOrderType,
  ) {
    switch (orderBy) {
      case PostOrderType.CREATED:
        return qb.orderBy('post.createdAt', 'DESC');
      case PostOrderType.UPDATED:
        return qb.orderBy('post.updatedAt', 'DESC');
      case PostOrderType.PUBLISHED:
        return qb.orderBy('post.publishedAt', 'DESC');
      case PostOrderType.CUSTOM:
        return qb.orderBy('customOrder', 'DESC');
      case PostOrderType.COMMENT_COUNT:
        return qb.orderBy('customOrder', 'DESC');
      default:
        return qb
          .orderBy('post.createdAt', 'DESC')
          .addOrderBy('post.updatedAt', 'DESC')
          .addOrderBy('post.publishedAt', 'DESC')
          .addOrderBy('commentCount', 'DESC');
    }
  }

  /**
   * 查询出分类及其后代分类下的所有文章的Query构建
   * @param id
   * @param qb
   */
  protected async queryByCategory(
    id: string,
    qb: SelectQueryBuilder<PostEntity>,
  ) {
    const root = await this.categoryService.detail(id);
    const tree = await this.categoryRepository.findDescendantsTree(root);
    const flatDes = await this.categoryRepository.toFlatTrees(tree.children);
    const ids = [tree.id, ...flatDes.map((item) => item.id)];
    return qb.where('category.id IN (:...ids)', {
      ids,
    });
  }
}
