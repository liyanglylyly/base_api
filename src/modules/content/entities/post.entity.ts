import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { PostBodyType } from '@/modules/content/constants';
import { Exclude, Expose, Type } from 'class-transformer';
import { CategoryEntity } from '@/modules/content/entities/category.entity';
import { TagEntity } from '@/modules/content/entities/tag.entity';
import { CommentEntity } from '@/modules/content/entities/comment.entity';
import { UserEntity } from '@/modules/user/entities';

@Entity('post')
@Exclude()
export class PostEntity extends BaseEntity {
  @Expose()
  @PrimaryColumn({ type: 'varchar', generated: 'uuid', length: 36 })
  id: string;

  @Expose()
  @Column({ comment: '文章标题' })
  title: string;

  @Expose({ groups: ['post-detail'] })
  @Column({ comment: '文章内容', type: 'text' })
  body: string;

  @Expose()
  @Column({ comment: '文章描述', nullable: true })
  summary?: string;

  @Expose()
  @Column({ comment: '关键字', type: 'simple-array', nullable: true })
  keywords?: string[];

  @Expose()
  @Column({
    comment: '文章类型',
    type: 'enum',
    enum: PostBodyType,
    default: PostBodyType.MD,
  })
  type: PostBodyType;

  @Expose()
  @Column({
    comment: '发布时间',
    type: 'varchar',
    nullable: true,
  })
  publishedAt?: Date | null;

  @Expose()
  @Column({ comment: '自定义文章排序', default: 0 })
  customOrder: number;

  @Expose()
  @Type(() => Date)
  @CreateDateColumn({
    comment: '创建时间',
  })
  createdAt: Date;

  @Expose()
  @Type(() => Date)
  @UpdateDateColumn({
    comment: '更新时间',
  })
  updatedAt: Date;

  /**
   * 通过queryBuilder生成的评论数量(虚拟字段)
   */
  @Expose()
  commentCount: number;

  @Expose()
  @ManyToOne(() => CategoryEntity, (category) => category.posts, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  category: Relation<CategoryEntity>;

  @Expose()
  @Type(() => TagEntity)
  @ManyToMany(() => TagEntity, (tag) => tag.posts, {
    cascade: true,
  })
  @JoinTable()
  tags: Relation<TagEntity>[];

  @OneToMany(() => CommentEntity, (comment) => comment.post, {
    cascade: true,
  })
  comments: Relation<CommentEntity>[];

  @Expose()
  @ManyToOne(() => UserEntity, (user) => user.posts, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  author: Relation<UserEntity>;
}
