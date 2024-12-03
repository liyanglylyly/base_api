import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigurationService } from '@/modules/config/services';

@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          inject: [ConfigurationService],
          imports: [],
          useFactory: (config: ConfigurationService) =>
            config.mysqlConfig as TypeOrmModuleOptions,
        }),
      ],
    };
  }
}
