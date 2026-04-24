import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  HttpCode,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionDto } from './dto/transactions.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async findAll(): Promise<TransactionDto[]> {
    return await this.transactionsService.findAll();
  }

  //show transactions + customers data + accounts.account_type
  @Get('with-details')
  findAllWithDetails() {
    return this.transactionsService.getAllTransactions();
  }

  @Get(':transactionId')
  async findOne(@Param('transactionId', ParseIntPipe) transactionId: number) {
    return await this.transactionsService.findOne(transactionId);
  }

  //all transactiosns from all accounts of particular user
  @Get('user/:userId')
  async findAllCurrentUSerTransactions(
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return await this.transactionsService.findCurrentUserAllTrx(userId);
  }

  @Post()
  create(@Body() createStatementDto: CreateTransactionDto) {
    return this.transactionsService.create(createStatementDto);
  }

  @Patch(':transactionId')
  @HttpCode(200)
  update(
    @Param('transactionId', ParseIntPipe) transactionId: number,
    @Body() updateStatementDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(transactionId, updateStatementDto);
  }

  @Delete(':transactionId')
  remove(@Param('transactionId', ParseIntPipe) transactionId: number) {
    return this.transactionsService.remove(transactionId);
  }
}
