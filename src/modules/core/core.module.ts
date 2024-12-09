import { DynamicModule, Module } from '@nestjs/common';
import { UniqueExistConstraint } from '@/modules/core/constrants/unique.exist.constraint';

@Module({})
export class CoreModule {
  static forRoot(): DynamicModule {
    return {
      module: CoreModule,
      global: true,
      providers: [UniqueExistConstraint],
      exports: [UniqueExistConstraint],
    };
  }
}
