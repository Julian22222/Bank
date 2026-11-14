import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AccountsModule } from './accounts/accounts.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AdminModule } from './admin/admin.module';
import { DatabaseModule } from './database/database.module';
import { MessagesModule } from './messages/messages.module';
import { AuthModule } from './auth/auth.module';
import { AuthAdminModule } from './auth-admin/auth-admin.module';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email/email.service';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { EmailVerificationService } from './email-verification/email-verification.service';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailVerificationModule } from './email-verification/email-verification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ThrottlerModule.forRoot([
      { name: 'default', ttl: 60_000, limit: 60 }, // global: 60 req/min
    ]),
    ScheduleModule.forRoot(), //Without this, @Cron is silently ignored.(from EmailVerificationService)

    UsersModule,
    AccountsModule,
    TransactionsModule,
    AdminModule,
    DatabaseModule,
    MessagesModule,
    AuthModule,
    AuthAdminModule,
    EmailVerificationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    EmailService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    EmailVerificationService, // apply globally throttle
  ],
})
export class AppModule {}
