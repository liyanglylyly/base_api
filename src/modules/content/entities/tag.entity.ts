import { BaseEntity, Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { PostEntity } from '@/modules/content/entities/post.entity';
import { Exclude, Expose } from 'class-transformer';
@Entity('tag')
@Exclude()
export class TagEntity extends BaseEntity {
  @Expose()
  @PrimaryColumn({ type: 'varchar', generated: 'uuid', length: 36 })
  id: string;

  @Expose()
  @Column({ comment: '标签名称', unique: true })
  name: string;

  @Expose()
  @Column({ comment: '标签描述', nullable: true })
  description?: string;

  /**
   * 通过queryBuilder生成的文章数量(虚拟字段)
   */
  @Expose()
  postCount: number;

  @ManyToMany(() => PostEntity, (post) => post.tags)
  posts: Relation<PostEntity[]>;
}
