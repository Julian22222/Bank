import { Inject, Injectable, Logger } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from './database.module';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async query(query: string, params?: any[]) {
    try {
      this.logger.log(`Executing query: ${query}`);
      return await this.pool.query(query, params);
    } catch (error) {
      this.logger.error('Database error', error.stack);
      throw error;
    }
  }
}
