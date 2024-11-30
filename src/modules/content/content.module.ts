import { Module } from '@nestjs/common';
import * as controllers from '@/modules/content/controllers';
import * as services from '@/modules/content/services';
import * as repositories from '@/modules/content/repositories';

@Module({
  controllers: Object.values(controllers),
  providers: [...Object.values(services), ...Object.values(repositories)],
  exports: [...Object.values(services)],
})
export class ContentModule {}
