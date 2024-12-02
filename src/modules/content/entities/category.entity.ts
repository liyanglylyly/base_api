import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { PostEntity } from '@/modules/content/entities/post.entity';
import { Exclude, Expose, Type } from 'class-transformer';

@Entity('category')
@Tree('materialized-path')
@Exclude()
export class CategoryEntity extends BaseEntity {
  @Expose()
  @PrimaryColumn({ type: 'varchar', generated: 'uuid', length: 36 })
  id: string;

  @Expose()
  @Column({ comment: '分类名称', unique: true })
  name: string;

  @Expose({ groups: ['category-tree', 'category-list', 'category-detail'] })
  @Column({ comment: '分类排序', default: 0 })
  customOrder: number;

  @OneToMany(() => PostEntity, (post) => post.category, { cascade: true })
  posts: Relation<PostEntity>[];

  @Expose({ groups: ['category-list'] })
  depth = 0;

  @Expose({ groups: ['category-detail', 'category-list'] })
  @TreeParent({ onDelete: 'NO ACTION' })
  parent: Relation<CategoryEntity> | null;

  @Expose({ groups: ['category-tree'] })
  @Type(() => CategoryEntity)
  @TreeChildren({ cascade: true })
  children: Relation<CategoryEntity>[];
}