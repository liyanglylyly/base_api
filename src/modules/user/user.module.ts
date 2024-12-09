import { Global, Module } from '@nestjs/common';
import * as repositories from '@/modules/user/repositories';
import * as services from '@/modules/user/services';
import * as controllers from '@/modules/user/controllers';
import * as strategies from '@/modules/user/strategies';
import { JwtModule } from '@nestjs/jwt';
import { ConfigurationService } from '@/modules/config/services';
@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [],
      inject: [ConfigurationService],
      useFactory: (config: ConfigurationService) => ({
        secret: config.tokenSecret,
      }),
    }),
  ],
  controllers: Object.values(controllers),
  providers: [
    ...Object.values(repositories),
    ...Object.values(services),
    ...Object.values(strategies),
  ],
  exports: [...Object.values(services)],
})
export class UserModule {}
