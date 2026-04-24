import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { randomInt } from 'crypto';
import { AccountsService } from '../accounts/accounts.service';
import { TransactionsService } from '../transactions/transactions.service';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.module';
import { UpdatePasswordUserDto } from './dto/update-password-user.dto';
import { UserResponseDto } from './dto/response-user.dto';
import { AdminService } from '../admin/admin.service';
import { CreateMessageDto } from '../messages/dto/create-message.dto';
import { CreateTransactionDto } from 'src/transactions/dto/create-transaction.dto';
import { MessagesService } from '../messages/messages.service';
const bcrypt = require('bcrypt');

@Injectable()
export class UsersService {
  constructor(
    @Inject(PG_POOL) private readonly pool: Pool,
    private readonly accountsService: AccountsService,
    private readonly transactionsService: TransactionsService,
    private readonly adminService: AdminService,
    private readonly messagesService: MessagesService,
  ) {}

  async findAll(): Promise<UserResponseDto[]> {
    try {
      const allUsersFromDB = await this.pool
        .query(`SELECT customer_id, first_name, last_name, 
        email, phone, customer_address, dob, created_at FROM customers`);

      const data = allUsersFromDB.rows;

      const userDataNoPasswordArray: UserResponseDto[] = data.map((user) => ({
        customer_id: user.customer_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        customer_address: user.customer_address,
        dob: user.dob,
        created_at: user.created_at,
      }));

      return userDataNoPasswordArray;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new BadRequestException(error.message);
      // throw error;
    }
  }

  async findOne(id: number): Promise<UserResponseDto> {
    try {
      const userFromDB = await this.pool.query(
        `SELECT customer_id, first_name, last_name, 
        email, phone, customer_address, dob, created_at FROM customers WHERE customer_id = $1`,
        [id],
      );

      if (!userFromDB.rows.length) {
        throw new NotFoundException('User not found');
      }

      const data = userFromDB.rows[0];

      const userDataNoPassword: UserResponseDto = {
        customer_id: data.customer_id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        customer_address: data.customer_address,
        dob: data.dob,
        created_at: data.created_at,
      };

      return userDataNoPassword;
    } catch (error) {
      throw new BadRequestException(error.message);
      // throw error;
    }
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const {
      first_name,
      last_name,
      email,
      password,
      phone,
      customer_address,
      dob,
    } = createUserDto;

    const client = await this.pool.connect();

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      await client.query('BEGIN');

      let modifiedAccNr = '';

      const newUser = await client.query(
        `INSERT INTO customers (first_name, last_name, email, password, phone, customer_address, dob) VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING customer_id, first_name, last_name, email, phone, customer_address, dob, created_at`,
        [
          first_name,
          last_name,
          email,
          hashedPassword,
          phone,
          customer_address,
          dob,
        ],
      );

      if (!newUser.rows.length) {
        throw new BadRequestException('Failed to create user');
      }

      let newAccount;

      if (newUser.rows.length) {
        const generating6Digits = randomInt(100000, 1000000).toString();
        const gen8Digits = randomInt(10000000, 100000000).toString();

        modifiedAccNr =
          generating6Digits.slice(0, 2) +
          '-' +
          generating6Digits.slice(2, 4) +
          '-' +
          generating6Digits.slice(4) +
          ' / ' +
          gen8Digits;

        const accObj = {
          customer_id: newUser.rows[0].customer_id,
          account_type: 'Main',
          account_nr: modifiedAccNr,
        };

        newAccount = await this.accountsService.create(accObj, client);

        if (!newAccount) {
          throw new BadRequestException(
            'Failed to create account for the new user',
          );
        }
      }

      if (newAccount) {
        const transObj: CreateTransactionDto = {
          account_id: newAccount.account_id,
          customer_id: newUser.rows[0].customer_id,
          money_amount: 200,
          balance: 200,
          details: 'Initial deposit',
        };

        const newTransaction = await this.transactionsService.create(
          transObj,
          client,
        );

        if (!newTransaction) {
          throw new BadRequestException(
            'Failed to create initial statement for the new user',
          );
        }

        const userData = newUser.rows[0];

        const welcomeMsg = `Dear ${userData.first_name} ${userData.last_name},\n\n
        Welcome to BIG bank, and thank you for opening a new account with us.\n\n
        We’re delighted to have you join us, and as a small token of our appreciation, we have credited £200 to your account.\n\n
        If you have any questions or need assistance, our team is always here to help.\n\n
        Thank you for choosing us.\n\n
        Kind regards,\n
        Your Bank Team.`;

        const newMsg: CreateMessageDto = {
          customer_id: userData.customer_id,
          msg_subject: 'Welcome to BIG Bank',
          msg_status: 'common',
          msg_body: welcomeMsg,
          msg_created_by: 'autogenerated',
        };

        const createNewMsg = await this.messagesService.create(newMsg, client);

        if (!createNewMsg) {
          throw new BadRequestException(
            'Failed to create message for the new user',
          );
        }
      }

      const userData = newUser.rows[0];

      const new_user: UserResponseDto = {
        customer_id: userData.customer_id,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        phone: userData.phone,
        customer_address: userData.customer_address,
        dob: userData.dob,
        created_at: userData.created_at,
      };

      await client.query('COMMIT');

      return new_user;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error creating user:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const fields: string[] = [];
    const values: any[] = [];
    let index = 1;

    for (const [key, value] of Object.entries(updateUserDto)) {
      if (value !== undefined) {
        fields.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
    }

    if (fields.length === 0) {
      throw new BadRequestException('No fields to update');
    }

    values.push(id);

    const query = `
    UPDATE customers
    SET ${fields.join(', ')}
    WHERE customer_id = $${index}
    RETURNING customer_id, first_name, last_name, email, phone, customer_address, dob, created_at
  `;

    try {
      const result = await this.pool.query(query, values);

      if (!result.rows.length) {
        throw new NotFoundException('Error, User not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error updating user info', error);
      throw error;
    }
  }

  async updatePassword(
    userId: number,
    updatePasswordUserDto: UpdatePasswordUserDto,
  ): Promise<{ message: string }> {
    try {
      const result = await this.pool.query(
        `SELECT password FROM customers WHERE customer_id = $1`,
        [userId],
      );

      const user = result.rows[0];

      if (!user) {
        throw new BadRequestException('User not found');
      }
      const isMatch = await bcrypt.compare(
        updatePasswordUserDto.oldPassword,
        user.password,
      );

      if (!isMatch) {
        throw new BadRequestException('Old password is incorrect');
      }

      const hashedPassword = await bcrypt.hash(
        updatePasswordUserDto.newPassword,
        10,
      );

      await this.pool.query(
        `UPDATE customers SET password = $1 WHERE admin_id = $2`,
        [hashedPassword, userId],
      );

      return { message: 'Password updated successfully' };
    } catch (error) {
      console.error('Error updating user password', error);
      throw error;
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');

      await this.messagesService.removeAllUsersMessages(id, client);

      await this.transactionsService.removeAllUserTrx(id, client);

      await this.accountsService.removeAllUserAcc(id, client);

      const deletedUser = await client.query(
        `DELETE FROM customers WHERE customer_id = $1 RETURNING *;`,
        [id],
      );

      if (deletedUser.rowCount === 0) {
        throw new NotFoundException('User not found');
      }

      await client.query('COMMIT');

      return { message: 'User deleted successfully' };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error deleting user:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}
