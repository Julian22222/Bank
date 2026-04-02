import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AccountsModule } from './accounts/accounts.module';
import { StatementsModule } from './statements/statements.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [UsersModule, AccountsModule, StatementsModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
