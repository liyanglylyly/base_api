import { Module } from '@nestjs/common';
import { ContentModule } from '@/modules/content/content.module';
import { CoreModule } from '@/modules/core/core.module';
import { DatabaseModule } from '@/modules/database/database.module';
import { database } from '@/config/database.config';

@Module({
  imports: [
    ContentModule,
    CoreModule.forRoot(),
    DatabaseModule.forRoot(database),
  ],
})
export class AppModule {}
