import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AccountsModule } from '../accounts/accounts.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { DatabaseModule } from '../database/database.module';
import { AdminModule } from '../admin/admin.module';
import { MessagesModule } from '../messages/messages.module';

@Module({
  imports: [
    AccountsModule,
    TransactionsModule,
    DatabaseModule,
    AdminModule,
    MessagesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
