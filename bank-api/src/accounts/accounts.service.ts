import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AdminService } from '../admin/admin.service';
import { TransactionsService } from '../transactions/transactions.service';

// const pool = require('../../data/dbconnection');

import { PoolClient, Pool } from 'pg';
import { PG_POOL } from '../database/database.module';
import { CreateMessageDto } from '../messages/dto/create-message.dto';
import { AccountDto } from './dto/account.dto';
import { MessagesService } from '../messages/messages.service';

@Injectable()
export class AccountsService {
  constructor(
    @Inject(PG_POOL) private readonly pool: Pool,
    private readonly adminService: AdminService,
    private readonly transactionsService: TransactionsService,
    private readonly messagesService: MessagesService,
  ) {}

  async findAll(): Promise<AccountDto[]> {
    try {
      const allAccounts = await this.pool.query('SELECT * FROM accounts');

      return allAccounts.rows;
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw error;
      // throw new Error('Error fetching accounts: ' + error.message);
    }
  }

  //show accounts table + customers data
  async getAllAccountsCustomers() {
    try {
      const result = await this.pool.query(
        `SELECT accounts.*, customers.first_name, customers.last_name, customers.email, customers.phone, customers.customer_address, customers.dob FROM accounts LEFT JOIN customers ON accounts.customer_id = customers.customer_id`,
      );

      if (!result.rows.length) {
        throw new NotFoundException('Accounts not found');
      }

      return result.rows;
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw error;
    }
  }

  //account data + balance
  async findUserAccountAndBalance(id: number) {
    try {
      const resultArr = await this.pool.query(
        `SELECT accounts.*, transactions.balance FROM accounts LEFT JOIN transactions ON accounts.account_id = transactions.account_id WHERE accounts.account_id = $1`,
        [id],
      );

      if (!resultArr.rows.length) {
        throw new NotFoundException('Account and Balance not found');
      }

      return resultArr.rows[resultArr.rows.length - 1];
    } catch (error) {
      console.error('Error fetching Account and Balance:', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<AccountDto> {
    try {
      const allAccountsOfUser = await this.pool.query(
        `SELECT * FROM accounts WHERE account_id = $1`,
        [id],
      );

      if (allAccountsOfUser.rows.length === 0) {
        throw new NotFoundException('Account not found');
      }

      return allAccountsOfUser.rows[0];
    } catch (error) {
      console.error('Error fetching account:', error);
      throw error;
    }
  }

  async create(
    createAccountDto: CreateAccountDto,
    client?: PoolClient,
  ): Promise<AccountDto> {
    const executor = client ?? this.pool;

    const { customer_id, account_type, account_nr } = createAccountDto;

    try {
      const result = await executor.query(
        `INSERT INTO accounts (customer_id, account_type, account_nr) VALUES ($1, $2, $3) RETURNING *;`,
        [customer_id, account_type, account_nr],
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  }

  async update(
    account_id: number,
    updateAccountDto: UpdateAccountDto,
  ): Promise<AccountDto> {
    const fields: string[] = [];
    const values: any[] = [];
    let index = 1;

    for (const [key, value] of Object.entries(updateAccountDto)) {
      if (value !== undefined) {
        fields.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
    }

    if (fields.length === 0) {
      throw new BadRequestException('No fields to update');
    }

    values.push(account_id);

    const query = `
    UPDATE accounts
    SET ${fields.join(', ')}
    WHERE account_id = $${index}
    RETURNING *
  `;

    try {
      const result = await this.pool.query(query, values);

      if (!result.rows.length) {
        throw new NotFoundException('Error, User not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error updating account:', error);
      throw error;
    }
  }

  async remove(accountId: number) {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');

      const accountsWithCustomers = await this.getAllAccountsCustomers();

      const customerData = accountsWithCustomers.find(
        (user) => user.account_id === accountId,
      );

      if (!customerData) {
        throw new NotFoundException('Account not found');
      }

      const customerId = customerData.customer_id;

      const customerName = customerData.first_name + customerData.last_name;

      const DeletedMsg = `Dear ${customerName}, Unfortunately your account has been closed.`;

      const newMsg: CreateMessageDto = {
        customer_id: customerId,
        msg_subject: 'Account deletion',
        msg_status: 'common',
        msg_body: DeletedMsg,
        msg_created_by: 'autogenerated',
      };

      await this.messagesService.create(newMsg, client);

      await this.transactionsService.removeAllAccountTrx(accountId, client);

      const deletedAccount = await client.query(
        `DELETE FROM accounts WHERE account_id = $1 RETURNING *;`,
        [accountId],
      );

      if (deletedAccount.rowCount === 0) {
        throw new NotFoundException('Account not found');
      }

      await client.query('COMMIT');

      return { message: 'Account deleted successfully' };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error deleting account:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async removeAllUserAcc(id: number, client?: PoolClient) {
    const executor = client ?? this.pool;

    try {
      const deletedAccount = await executor.query(
        `DELETE FROM accounts WHERE customer_id = $1 RETURNING *;`,
        [id],
      );

      if (deletedAccount.rowCount === 0) {
        throw new NotFoundException('Accounts not found');
      }

      return { message: 'All Accounts deleted successfully' };
    } catch (error) {
      console.error('Error deleting accounts:', error);
      throw error;
    }
  }
}
