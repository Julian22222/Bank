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

  create(createStatementDto: CreateStatementDto) {
    // return 'This action adds a new statement';

    //Alternatively, insert a new transaction into the database:

    const { account_id, customer_id, money_in, money_out, balance, details } =
      createStatementDto;

    try {
      const result = pool.query(
        `INSERT INTO transactions (account_id, customer_id, money_in, money_out, balance, details) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
        [account_id, customer_id, money_in, money_out, balance, details],
      );
      //use RETURNING * to get the newly created transaction record
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
