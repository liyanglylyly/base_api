import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Exclude, Expose, Type } from 'class-transformer';
import { PostEntity } from '@/modules/content/entities/post.entity';
import { UserEntity } from '@/modules/user/entities';

@Entity('comment')
@Tree('materialized-path')
@Exclude()
export class CommentEntity extends BaseEntity {
  @Expose()
  @PrimaryColumn({ type: 'varchar', generated: 'uuid', length: 36 })
  id: string;

  @Expose()
  @Column({ comment: '评论内容', type: 'text' })
  body: string;

  @Expose()
  @Type(() => Date)
  @CreateDateColumn({
    comment: '创建时间',
  })
  createdAt: Date;

  @Expose()
  @ManyToOne(() => PostEntity, (post) => post.comments, {
    nullable: false,
    // 跟随父表删除与更新
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  post: Relation<PostEntity>;

  @Expose({ groups: ['comment-list'] })
  depth = 0;

  @Expose({ groups: ['comment-detail', 'comment-list'] })
  @TreeParent({ onDelete: 'CASCADE' })
  parent: Relation<CommentEntity> | null;

  @TreeChildren({ cascade: true })
  @Type(() => CommentEntity)
  @TreeChildren({ cascade: true })
  children: Relation<CommentEntity>[];

  @Expose()
  @ManyToOne(() => UserEntity, (user) => user.comments, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  author: Relation<UserEntity>;
}
