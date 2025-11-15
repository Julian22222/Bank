import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
const pool = require('../../data/dbconnection');

@Injectable()
export class AccountsService {
  async findAll() {
    // return `This action returns all accounts`;

    // Alternatively, to fetch all accounts from the database:
    try {
      const allAccounts = await pool.query('SELECT * FROM accounts');

      return allAccounts.rows;
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw error;
      // throw new Error('Error fetching accounts: ' + error.message);
    }
  }

  async findOne(id: number) {
    // return `This action returns a #${id} account`;

    // Alternatively, to fetch a single account from the database by ID:
    try {
      const allAccountsOfUser = await pool.query(
        `SELECT * FROM accounts WHERE customer_id = $1`,
        [id],
      );
      return allAccountsOfUser.rows;
    } catch (error) {
      console.error('Error fetching account:', error);
      throw error;
    }
  }

  create(createAccountDto: CreateAccountDto) {
    // return 'This action adds a new account';

    // Alternatively, to insert a new account into the database:
    const { customer_id, account_type } = createAccountDto;

    try {
      const result = pool.query(
        `INSERT INTO accounts (customer_id, account_type) VALUES ($1, $2) RETURNING *;`,
        [customer_id, account_type],
      );
      //use RETURNING * to get the newly created account record
      //you only need RETURNING * when you want PostgreSQL to give you back the inserted (or updated/deleted) row immediately after the query.
      //Use RETURNING * --> with INSERT, UPDATE, or DELETE statements if you want to see what was affected.
      //DON'T use RETURNING * --> with SELECT statements.
      return result.rows[0];
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  }

  // update(id: number, updateAccountDto: UpdateAccountDto) {
  //   return `This action updates a #${id} account`;
  // }

  remove(id: number) {
    // return `This action removes a #${id} account`;

    // Alternatively, to delete an account from the database by ID:
    try {
      const deletedAccount = pool.query(
        `DELETE FROM accounts WHERE account_id = $1 RETURNING *;`,
        [id],
      );
      //use RETURNING * to get the deleted account record

      return 'User account deleted successfully';
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  }
}
