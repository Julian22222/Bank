import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
// const pool = require('../../data/dbconnection');
import { PoolClient, Pool } from 'pg';
import { PG_POOL } from '../database/database.module';
import { TransactionDto } from './dto/transactions.dto';

@Injectable()
export class TransactionsService {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async findAll(): Promise<TransactionDto[]> {
    try {
      const allTransactions = await this.pool.query(
        'SELECT * FROM transactions',
      );

      if (!allTransactions.rows.length) {
        throw new NotFoundException('Transactions not found');
      }

      return allTransactions.rows;
    } catch (error) {
      console.error('Error fetching statements:', error);
      throw error;
    }
  }

  //show transactions + customers data + accounts.account_type
  async getAllTransactions() {
    try {
      const result = await this.pool.query(
        `SELECT transactions.*, customers.first_name, customers.last_name, customers.email, customers.phone, customers.customer_address, customers.dob, accounts.account_type 
        FROM transactions LEFT JOIN customers ON transactions.customer_id = customers.customer_id
        LEFT JOIN accounts ON transactions.account_id = accounts.account_id`,
      );

      if (!result.rows.length) {
        throw new NotFoundException(
          'All data (trx + customer`s data + accounts) not found',
        );
      }

      return result.rows;
    } catch (error) {
      console.error('Error fetching user all accounts transactions::', error);
      throw error;
    }
  }

  async findOne(transactionId: number): Promise<TransactionDto> {
    try {
      const transaction = await this.pool.query(
        `SELECT * FROM transactions WHERE transaction_id = $1`,
        [transactionId],
      );

      if (!transaction.rows.length) {
        throw new NotFoundException('Transaction not found');
      }

      return transaction.rows[0];
    } catch (error) {
      console.error('Error fetching statement:', error);
      throw error;
    }
  }

  //all transactiosns from all accounts of particular user
  async findCurrentUserAllTrx(userId: number) {
    try {
      const allTransactionsOfUser = await this.pool.query(
        `SELECT * FROM transactions WHERE customer_id = $1`,
        [userId],
      );

      if (!allTransactionsOfUser.rows.length) {
        throw new NotFoundException('All transactions for this user not found');
      }

      return allTransactionsOfUser.rows;
    } catch (error) {
      console.error('Error fetching statement:', error);
      throw error;
    }
  }

  async create(
    createStatementDto: CreateTransactionDto,
    client?: PoolClient,
  ): Promise<TransactionDto> {
    const executor = client ?? this.pool;

    const { account_id, customer_id, money_amount, balance, details } =
      createStatementDto;

    try {
      const result = await executor.query(
        `INSERT INTO transactions (account_id, customer_id, money_amount, balance, details) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
        [account_id, customer_id, money_amount, balance, details],
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error creating statement:', error);
      throw error;
    }
  }

  async update(
    transactionId: number,
    updateStatementDto: UpdateTransactionDto,
  ): Promise<TransactionDto> {
    const fields: string[] = [];
    const values: any[] = [];
    let index = 1;

    for (const [key, value] of Object.entries(updateStatementDto)) {
      if (value !== undefined) {
        fields.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
    }

    if (fields.length === 0) {
      throw new BadRequestException('No fields to update');
    }

    values.push(transactionId);

    const query = `
    UPDATE transactions
    SET ${fields.join(', ')}
    WHERE transaction_id = $${index}
    RETURNING *
  `;

    try {
      const result = await this.pool.query(query, values);

      if (!result.rows.length) {
        throw new NotFoundException('Error, Transaction not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  }

  async remove(transactionId: number) {
    try {
      const deletedTrx = await this.pool.query(
        `DELETE FROM transactions WHERE transaction_id = $1 RETURNING *;`,
        [transactionId],
      );

      if (deletedTrx.rowCount === 0) {
        throw new NotFoundException('Transaction not found');
      }

      return { message: 'Transaction deleted successfully' };
    } catch (error) {
      console.error('Error deleted transaction:', error);
      throw error;
    }
  }

  async removeAllUserTrx(userId: number, client?: PoolClient) {
    const executor = client ?? this.pool;

    try {
      const deletedTrx = await executor.query(
        `DELETE FROM transactions WHERE customer_id = $1 RETURNING *;`,
        [userId],
      );

      if (deletedTrx.rowCount === 0) {
        throw new NotFoundException('Transactions not found');
      }

      return { message: 'All transactions deleted successfully for this user' };
    } catch (error) {
      console.error('Error deleted transactions:', error);
      throw error;
    }
  }

  async removeAllAccountTrx(accountId: number, client?: PoolClient) {
    const executor = client ?? this.pool;

    try {
      const deletedTrx = await executor.query(
        `DELETE FROM transactions WHERE account_id = $1 RETURNING *;`,
        [accountId],
      );

      return {
        message: 'All account transactions deleted successfully for this user',
      };
    } catch (error) {
      console.error('Error deleted transactions:', error);
      throw error;
    }
  }
}
