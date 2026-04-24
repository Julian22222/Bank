import { Module } from '@nestjs/common';
import { Pool } from 'pg';
require('dotenv').config();

export const PG_POOL = 'PG_POOL';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

@Module({
  providers: [
    {
      provide: PG_POOL,
      useValue: pool,
    },
  ],
  exports: [PG_POOL],
})
export class DatabaseModule {}
