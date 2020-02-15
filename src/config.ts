import 'reflect-metadata';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import { Listing, Price } from '@entities';

export const typeormConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'test',
  synchronize: false,
  logging: false,
  schema: 'data',
  entities: [Listing, Price],
};
