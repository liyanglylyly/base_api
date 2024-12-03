import { Module } from '@nestjs/common';
import { ContentModule } from '@/modules/content/content.module';
import { CoreModule } from '@/modules/core/core.module';
import { DatabaseModule } from '@/modules/database/database.module';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AppFilter, AppInterceptor, AppPipe } from '@/modules/core/providers';
import { ConfigureModule } from '@/modules/config/configure.module';

@Module({
  imports: [
    ContentModule,
    CoreModule.forRoot(),
    DatabaseModule.forRoot(),
    ConfigureModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new AppPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
        validationError: { target: false },
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AppInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AppFilter,
    },
  ],
})
export class AppModule {}
