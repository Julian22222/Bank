// verification.repo.ts
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.module';

@Injectable()
export class VerificationRepo {
  private readonly logger = new Logger(VerificationRepo.name);

  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  //Delete
  async invalidateOld(customerId: number) {
    await this.pool.query(
      `DELETE FROM email_verifications WHERE customer_id = $1 AND used_at IS NULL`,
      [customerId],
    );
  }

  async create(data: { userId: number; tokenHash: string; expiresAt: Date }) {
    await this.pool.query(
      `INSERT INTO email_verifications (customer_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [data.userId, data.tokenHash, data.expiresAt],
    );
  }

  async consumeToken(tokenHash: string): Promise<number | null> {
    const { rows } = await this.pool.query(
      `UPDATE email_verifications
       SET used_at = NOW()
       WHERE token_hash = $1 AND used_at IS NULL AND expires_at > NOW()
       RETURNING customer_id`,
      [tokenHash],
    );
    return rows[0]?.customer_id ?? null;
  }

  //Cron methods belong in providers, not in controllers.
  //Expired rows pile up, so delete them periodically, for example with @nestjs/schedule:
  // every day at 03:00 server time
  @Cron('0 3 * * *')
  async cleanup() {
    try {
      await this.pool.query(
        `DELETE FROM email_verifications WHERE expires_at < NOW()`,
      );
    } catch (error) {
      this.logger.error(error);
    }
  }
}
