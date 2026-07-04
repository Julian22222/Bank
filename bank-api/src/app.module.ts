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

@Module({
  imports: [
    UsersModule,
    AccountsModule,
    TransactionsModule,
    AdminModule,
    DatabaseModule,
    MessagesModule,
    AuthModule,
    AuthAdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
