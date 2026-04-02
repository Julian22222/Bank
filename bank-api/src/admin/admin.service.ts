import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
const pool = require('../../data/dbconnection');

@Injectable()
export class AdminService {
  async getAllUsers() {
    try {
      const result = await pool.query(`SELECT * FROM customers`);

      return result.rows;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async findUser(id: number) {
    try {
      const result = await pool.query(`SELECT * FROM customers WHERE id = $1`, [
        id,
      ]);
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  async getAllAccounts() {
    try {
      const result = await pool.query(
        `SELECT accounts.*, customers.first_name, customers.last_name, customers.email, customers.password, customers.phone, customers.customer_address, customers.dob FROM accounts LEFT JOIN customers ON accounts.customer_id = customers.id`,
      );

      return result.rows;
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw error;
    }
  }

  async getAllTransactions() {
    try {
      const result = await pool.query(
        `SELECT transactions.*, customers.first_name, customers.last_name, customers.email, customers.password, customers.phone, customers.customer_address, customers.dob FROM transactions LEFT JOIN customers ON transactions.customer_id = customers.id`,
      );

      return result.rows;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  // create(createAdminDto: CreateAdminDto) {
  //   return 'This action adds a new admin';
  // }

  // update(id: number, updateAdminDto: UpdateAdminDto) {
  //   return `This action updates a #${id} admin`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} admin`;
  // }
}
