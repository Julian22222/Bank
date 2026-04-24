import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { DatabaseModule } from '../database/database.module';
import { AdminModule } from '../admin/admin.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { MessagesModule } from '../messages/messages.module';

@Module({
  imports: [AdminModule, TransactionsModule, DatabaseModule, MessagesModule],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
