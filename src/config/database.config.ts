import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';
// export const database = (): TypeOrmModuleOptions => ({
//   type: 'better-sqlite3',
//   database: resolve(__dirname, '../../database.db'),
//   synchronize: true,
//   autoLoadEntities: true,
// });

export const database = (): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: '124.222.232.4',
  port: 3306,
  database: 'cms',
  username: 'root',
  password: 'admin123',
  entities: [path.join(__dirname, '..', '**', '*.entity.{ts,js}')],
  autoLoadEntities: true,
  synchronize: true,
  logging: true,
});
