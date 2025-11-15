import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
// import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  async findAll() {
    return await this.accountsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.accountsService.findOne(+id);
  }

  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(createAccountDto);
  }

  //   @Patch(':id')
  //   update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
  //     return this.accountsService.update(+id, updateAccountDto);
  //   }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountsService.remove(+id);
  }
}
