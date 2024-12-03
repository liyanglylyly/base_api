import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as services from '@/modules/config/services';
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: Object.values(services),
  exports: Object.values(services),
})
export class ConfigureModule {}
