import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountDto } from './dto/account.dto';
import { UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  findAll(): Promise<AccountDto[]> {
    return this.accountsService.findAll();
  }

  //show all accounts data + customers data
  @Get('with-customers')
  findAllWithCustomers() {
    return this.accountsService.getAllAccountsCustomers();
  }

  //all user accounts data + balance
  @Get('user/:userId/accounts-balance')
  findAllUserAccountsAndBalance(@Param('userId', ParseIntPipe) userId: number) {
    return this.accountsService.findUserAccounts_withBalance(userId);
  }

  //get ID from JWT and then get all accounts + balance for this user
  @Get('my-accounts-balance')
  @UseGuards(JwtAuthGuard) // This route is protected, only accessible with a valid JWT
  getMyAccountsAndBalance(@Req() req) {
    console.log(
      'FROM AccountsController - Current user from JWT payload:',
      req.user,
    );

    return this.accountsService.findUserAccounts_withBalance(req.user.sub);
  }

  //one user account data + balance
  @Get('user/:accountId/with-balance')
  searchUsersAccountAndBalance(
    @Param('accountId', ParseIntPipe) accountId: number,
  ) {
    return this.accountsService.findUserAccountAndBalance(accountId);
  }

  @Get(':accountId')
  findOne(
    @Param('accountId', ParseIntPipe) accountId: number,
  ): Promise<AccountDto> {
    return this.accountsService.findOne(accountId);
  }

  //create account when user register + transactions data
  @Post()
  create(@Body() createAccountDto: CreateAccountDto): Promise<AccountDto> {
    return this.accountsService.create(createAccountDto);
  }

  //create account for saving account type-> + transactions data
  @Post('saving')
  createForSavingAccount(
    @Body() createAccountDto: CreateAccountDto,
  ): Promise<AccountDto> {
    return this.accountsService.createForSavingAccount(createAccountDto);
  }

  @Patch(':accountId')
  update(
    @Param('accountId', ParseIntPipe) accountId: number,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<AccountDto> {
    return this.accountsService.update(accountId, updateAccountDto);
  }

  @Delete(':accountId')
  remove(
    @Param('accountId', ParseIntPipe) accountId: number,
  ): Promise<{ message: string }> {
    return this.accountsService.remove(accountId);
  }
}
