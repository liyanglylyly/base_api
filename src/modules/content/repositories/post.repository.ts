import { BaseRepository } from '@/modules/database/base/repository';
import { CommentEntity, PostEntity } from '@/modules/content/entities';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostRepository extends BaseRepository<PostEntity> {
  protected _qbName: string = 'post';
  constructor(private datasource: DataSource) {
    super(PostEntity, datasource.createEntityManager());
  }
  buildBaseQB() {
    // 在查询之前先查询出评论数量在添加到commentCount字段上
    return this.createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.tags', 'tags')
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(c.id)', 'count')
          .from(CommentEntity, 'c')
          .where('c.post.id = post.id');
      }, 'commentCount')
      .loadRelationCountAndMap('post.commentCount', 'post.comments');
  }
}
