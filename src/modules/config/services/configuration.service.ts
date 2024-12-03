import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';

@Injectable()
export class ConfigurationService {
  constructor(private configService: ConfigService) {}

  get mysqlConfig() {
    return {
      type: this.configService.get<string>('MYSQL_TYPE'),
      host: this.configService.get<string>('MYSQL_HOST'),
      port: this.configService.get<number>('MYSQL_PORT'),
      database: this.configService.get<string>('MYSQL_DATABASE'),
      username: this.configService.get<string>('MYSQL_USERNAME'),
      password: this.configService.get<string>('MYSQL_PASSWORD'),
      autoLoadEntities: true,
      synchronize: false,
      logging: true,
      entities: [path.join(__dirname, '../../..', '**', '*.entity.{ts,js}')],
    } as TypeOrmModuleOptions;
  }
}
