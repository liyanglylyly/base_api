import {
  DataSource,
  EntitySubscriberInterface,
  EntityTarget,
  EventSubscriber,
  InsertEvent,
  ObjectLiteral,
  ObjectType,
  RecoverEvent,
  RemoveEvent,
  SoftRemoveEvent,
  TransactionCommitEvent,
  TransactionRollbackEvent,
  TransactionStartEvent,
  UpdateEvent,
} from 'typeorm';
import { isNil } from 'lodash';
type SubscriberEvent<E extends ObjectLiteral> =
  | InsertEvent<E>
  | UpdateEvent<E>
  | SoftRemoveEvent<E>
  | RemoveEvent<E>
  | RecoverEvent<E>
  | TransactionStartEvent
  | TransactionCommitEvent
  | TransactionRollbackEvent;

/**
 * 基础模型观察者
 */
@EventSubscriber()
export abstract class BaseSubscriber<E extends ObjectLiteral>
  implements EntitySubscriberInterface<E>
{
  /**
   * 监听的模型
   */
  protected abstract entity: ObjectType<E>;

  listenTo() {
    return this.entity;
  }

  async afterLoad(entity: any) {
    // 是否启用树形
    if ('parent' in entity && isNil(entity.depth)) entity.depth = 0;
  }

  /**
   * 判断某个字段是否被更新
   * @param column
   * @param event
   */
  protected isUpdated(column: keyof E, event: UpdateEvent<E>) {
    return !!event.updatedColumns.find((item) => item.propertyName === column);
  }
}
