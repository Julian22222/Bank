import { Injectable } from '@nestjs/common';
import { CreateStatementDto } from './dto/create-statement.dto';
import { UpdateStatementDto } from './dto/update-statement.dto';
const pool = require('../../data/dbconnection');

@Injectable()
export class StatementsService {
  async findAll() {
    //   return `This action returns all statements`;

    // Alternatively, get all statements from the database:
    try {
      const allTransactions = await pool.query('SELECT * FROM transactions');

      return allTransactions.rows;
    } catch (error) {
      console.error('Error fetching statements:', error);
      throw error;
      // throw new Error('Error fetching statements: ' + error.message);
    }
  }

  async findOne(id: number) {
    // return `This action returns a #${id} statement`;

    // Alternatively, get all transactions from the database by user ID:
    try {
      const allTransactionsOfUser = await pool.query(
        `SELECT * FROM transactions WHERE customer_id = $1`,
        [id],
      );
      return allTransactionsOfUser.rows;
    } catch (error) {
      console.error('Error fetching statement:', error);
      throw error;
    }
  }

  // Get the latest balance for a specific account, to use when creating a new transaction (e.g., for payments) -In bankapp/src/actions/payModuleActions.ts
  //Calculate new balance in the backend, not in Next.js frontend
  async findBalance(account_id: number) {
    try {
      const result = await pool.query(
        `SELECT balance FROM transactions WHERE account_id = $1 ORDER BY transaction_id DESC LIMIT 1`,
        [account_id],
      );

      if (result.rows.length === 0) {
        throw new Error('No transactions found for this account.');
      }

      return result.rows[0].balance;
    } catch (error) {
      console.error('Error fetching balance:', error);
      throw error;
    }
  }

  async create(createStatementDto: CreateStatementDto) {
    // return 'This action adds a new statement';

    //Alternatively, insert a new transaction into the database:

    const { account_id, customer_id, money_amount, balance, details } =
      createStatementDto;

    try {
      const result = await pool.query(
        `INSERT INTO transactions (account_id, customer_id, money_amount, balance, details) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
        [account_id, customer_id, money_amount, balance, details],
      );
      //use RETURNING * to get the newly created transaction record otherwise it returns only the rowCount and result summary, (general info)
      return result.rows[0];
    } catch (error) {
      console.error('Error creating statement:', error);
      throw error;
    }
  }

  //   update(id: number, updateStatementDto: UpdateStatementDto) {
  //     return `This action updates a #${id} statement`;
  //   }

  //   remove(id: number) {
  //     return `This action removes a #${id} statement`;
  //   }
}
