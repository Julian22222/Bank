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

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  async findAll(): Promise<AccountDto[]> {
    return await this.accountsService.findAll();
  }

  //show accounts table + customers data
  @Get('with-customers')
  findAllWithCustomers() {
    return this.accountsService.getAllAccountsCustomers();
  }

  //account data + balance
  @Get('user/:accountId/with-balance')
  async searchUsersAccountAndBalance(
    @Param('accountId', ParseIntPipe) accountId: number,
  ) {
    return await this.accountsService.findUserAccountAndBalance(accountId);
  }

  @Get(':accountId')
  async findOne(
    @Param('accountId', ParseIntPipe) accountId: number,
  ): Promise<AccountDto> {
    return await this.accountsService.findOne(accountId);
  }

  @Post()
  create(@Body() createAccountDto: CreateAccountDto): Promise<AccountDto> {
    return this.accountsService.create(createAccountDto);
  }

  @Patch(':accountId')
  update(
    @Param('accountId', ParseIntPipe) accountId: number,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<AccountDto> {
    return this.accountsService.update(accountId, updateAccountDto);
  }

  @Delete(':accountId')
  remove(@Param('accountId', ParseIntPipe) accountId: number) {
    return this.accountsService.remove(accountId);
  }
}
