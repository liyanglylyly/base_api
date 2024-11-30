import { DataSource, EventSubscriber } from 'typeorm';
import { SanitizeService } from '@/modules/content/services';
import { PostRepository } from '@/modules/content/repositories';
import { PostEntity } from '@/modules/content/entities';
import { PostBodyType } from '@/modules/content/constants';

@EventSubscriber()
export class PostSubscriber {
  constructor(
    protected dataSource: DataSource,
    protected sanitizeService: SanitizeService,
    protected postRepository: PostRepository,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return PostEntity;
  }

  /**
   * 加载文章数据的处理
   * @param entity
   */
  async afterLoad(entity: PostEntity) {
    if (entity.type === PostBodyType.HTML) {
      entity.body = this.sanitizeService.sanitize(entity.body);
    }
  }
}
