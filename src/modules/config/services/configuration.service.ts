import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';
import * as userSubscribers from '@/modules/user/subscribers';

@Injectable()
export class ConfigurationService {
  constructor(private configService: ConfigService) {}

  get accessTokenExpired() {
    return this.configService.get('JWT_ACCESS_TOKEN_EXPIRED');
  }

  get tokenSecret() {
    return this.configService.get('JWT_TOKEN_SECRET');
  }

  get refreshTokenSecret() {
    return this.configService.get('JWT_TOKEN_SECRET');
  }

  get accessTokenSecret() {
    return this.configService.get('JWT_TOKEN_SECRET');
  }

  get refreshTokenExpired() {
    return this.configService.get('JWT_REFRESH_TOKEN_EXPIRED');
  }

  get mysqlConfig() {
    return {
      type: this.configService.get<string>('MYSQL_TYPE'),
      host: this.configService.get<string>('MYSQL_HOST'),
      port: this.configService.get<number>('MYSQL_PORT'),
      database: this.configService.get<string>('MYSQL_DATABASE'),
      username: this.configService.get<string>('MYSQL_USERNAME'),
      password: this.configService.get<string>('MYSQL_PASSWORD'),
      autoLoadEntities: true,
      synchronize: true,
      logging: false,
      subscribers: [...Object.values(userSubscribers)],
      entities: [path.join(__dirname, '../../..', '**', '*.entity.{ts,js}')],
    } as TypeOrmModuleOptions;
  }
}
