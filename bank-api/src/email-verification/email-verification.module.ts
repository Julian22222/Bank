import { Module } from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';
import { EmailVerificationController } from './email-verification.controller';
import { UsersModule } from '../users/users.module';
import { DatabaseModule } from '../database/database.module';
import { EmailService } from '../email/email.service';
import { ConfigModule } from '@nestjs/config';
import { VerificationRepo } from './verification.repo';

@Module({
  imports: [UsersModule, DatabaseModule, ConfigModule],
  controllers: [EmailVerificationController],
  providers: [EmailVerificationService, VerificationRepo, EmailService],
  exports: [EmailVerificationService, VerificationRepo],
})
export class EmailVerificationModule {}
