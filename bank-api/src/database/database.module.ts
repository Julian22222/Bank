import { Module } from '@nestjs/common';
import { Pool } from 'pg';
// require('dotenv').config();

export const PG_POOL = 'PG_POOL';

@Module({
  providers: [
    {
      provide: PG_POOL,
      useFactory: () => {
        console.log('Creating PG pool');
        console.log('DB_HOST =', process.env.DB_HOST);

        return new Pool({
          user: process.env.DB_USER,
          host: process.env.DB_HOST,
          database: process.env.DB_DATABASE,
          password: process.env.DB_PASSWORD,
          port: Number(process.env.DB_PORT),
          // SSL configuration for secure connection to the database- Needs only for AWS RDS PostgreSQL
          ssl: {
            rejectUnauthorized: false,
          },
        });
      },
    },
  ],
  exports: [PG_POOL],
})
export class DatabaseModule {}
