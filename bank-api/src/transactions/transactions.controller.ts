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
  Req,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionDto } from './dto/transactions.dto';
import { TransactionWithDetailsDto } from './dto/transactionsWithDetails.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  findAll(): Promise<TransactionDto[]> {
    return this.transactionsService.findAll();
  }

  //show transactions + customers data + accounts.account_type
  @Get('with-details')
  findAllWithDetails(): Promise<TransactionWithDetailsDto[]> {
    return this.transactionsService.getAllTransactions();
  }

  @Get(':customer_id/accounts/:account_id')
  findUserSingleAccountTransactions(
    @Param('customer_id', ParseIntPipe) customer_id: number,
    @Param('account_id', ParseIntPipe) account_id: number,
  ) {
    return this.transactionsService.userSingleAccountAllTransactions(
      customer_id,
      account_id,
    );
  }

  //all user transactions from all accounts
  @Get('my')
  //Get userId from JWT cookies
  @UseGuards(JwtAuthGuard)
  getUserAllTransactions(@Req() req): Promise<TransactionDto[] | null> {
    console.log(
      'FROM TransactionsController - Current user from JWT payload:',
      req.user,
    );
    return this.transactionsService.findCurrentUserAllTrx(req.user.sub);
  }

  //all user transactions from all accounts
  @Get('user/:userId')
  findAllCurrentUSerTransactions(
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.transactionsService.findCurrentUserAllTrx(userId);
  }

  @Get(':transactionId')
  findOne(
    @Param('transactionId', ParseIntPipe) transactionId: number,
  ): Promise<TransactionDto> {
    return this.transactionsService.findOne(transactionId);
  }

  @Post()
  create(
    @Body() createStatementDto: CreateTransactionDto,
  ): Promise<TransactionDto> {
    return this.transactionsService.create(createStatementDto);
  }

  @Patch(':transactionId')
  @HttpCode(200)
  update(
    @Param('transactionId', ParseIntPipe) transactionId: number,
    @Body() updateStatementDto: UpdateTransactionDto,
  ): Promise<TransactionDto> {
    return this.transactionsService.update(transactionId, updateStatementDto);
  }

  @Delete(':transactionId')
  remove(
    @Param('transactionId', ParseIntPipe) transactionId: number,
  ): Promise<{ message: string }> {
    return this.transactionsService.remove(transactionId);
  }
}
