import { BaseTreeRepository } from '@/modules/database/base/tree.repository';
import { PostEntity, TagEntity } from '@/modules/content/entities';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class TagRepository extends BaseTreeRepository<TagEntity> {
  constructor(private datasource: DataSource) {
    super(TagEntity, datasource.createEntityManager());
  }

  buildBaseQB() {
    return this.createQueryBuilder('tag')
      .leftJoinAndSelect('tag.posts', 'posts')
      .addSelect(
        (subQuery) =>
          subQuery.select('COUNT(p.id)', 'count').from(PostEntity, 'p'),
        'postCount',
      )
      .orderBy('postCount', 'DESC')
      .loadRelationCountAndMap('tag.postCount', 'tag.posts');
  }
}
