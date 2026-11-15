// verification.repo.ts
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.module';

@Injectable()
export class VerificationRepo {
  private readonly logger = new Logger(VerificationRepo.name);

  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  //add verification token and verification expires to customers table,
  //then later you can compare with these data
  async addingVerificationToDB(data: {
    userId: number;
    tokenHash: string;
    expiresAt: Date;
  }) {
    await this.pool.query(
      `UPDATE customers
       SET verification_token_hash = $2, verification_expires_at = $3
       WHERE customer_id = $1`,
      [data.userId, data.tokenHash, data.expiresAt],
    );
  }

  //compare hashed token from the link with hashed token in customers DB
  async compareTokens(tokenHash: string): Promise<number | null> {
    const { rows } = await this.pool.query(
      `UPDATE customers
       SET email_verified = TRUE,
           verification_token_hash = NULL,
           verification_expires_at = NULL
       WHERE verification_token_hash = $1
         AND verification_expires_at > NOW()
         AND email_verified = FALSE
       RETURNING customer_id`,
      [tokenHash],
    );
    return rows[0]?.customer_id ?? null;
  }

  // @Cron('0 3 * * *')
  // async cleanup() {
  //   try {
  //     await this.pool.query(
  //       `UPDATE customers
  //        SET verification_token_hash = NULL, verification_expires_at = NULL
  //        WHERE verification_expires_at < NOW()`,
  //     );
  //   } catch (error) {
  //     this.logger.error(error);
  //   }
  // }
}
