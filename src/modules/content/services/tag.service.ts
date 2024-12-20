import { Injectable } from '@nestjs/common';
import { TagRepository } from '@/modules/content/repositories';
import {
  CreateTagDto,
  QueryTagDto,
  UpdateTagDto,
} from '@/modules/content/dtos';
import { paginate } from '@/modules/database/helpers';
import { omit } from 'lodash';

/**
 * 标签数据操作
 */
@Injectable()
export class TagService {
  constructor(protected repository: TagRepository) {}

  /**
   * 获取标签数据
   * @param options 分页选项
   */
  async paginate(options: QueryTagDto) {
    const qb = this.repository.buildBaseQB();
    return paginate(qb, options);
  }

  /**
   * 查询单个标签信息
   * @param id
   */
  async detail(id: string) {
    const qb = this.repository.buildBaseQB();
    qb.where(`tag.id = :id`, { id });
    return qb.getOneOrFail();
  }

  /**
   * 创建标签
   * @param data
   */
  async create(data: CreateTagDto) {
    const item = await this.repository.save(data);
    return this.detail(item.id);
  }

  /**
   * 更新标签
   * @param data
   */
  async update(data: UpdateTagDto) {
    await this.repository.update(data.id, omit(data, ['id']));
    return this.detail(data.id);
  }

  /**
   * 删除标签
   * @param id
   */
  async delete(id: string) {
    const item = await this.repository.findOneByOrFail({ id });
    return this.repository.remove(item);
  }
}
