import { BaseRepository } from '@/modules/database/base/repository';
import { PostEntity } from '@/modules/content/entities';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostRepository extends BaseRepository<PostEntity> {
  protected _qbName: string = 'post';
  constructor(private datasource: DataSource) {
    super(PostEntity, datasource.createEntityManager());
  }
}
