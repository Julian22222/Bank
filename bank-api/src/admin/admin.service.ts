import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
// const pool = require('../../data/dbconnection');
import { PoolClient, Pool } from 'pg';
import { PG_POOL } from '../database/database.module';
import { AdminResponseDto } from './dto/response-admin.dto';
import { UpdatePasswordAdminDto } from './dto/update-password.dto';
const bcrypt = require('bcrypt');

@Injectable()
export class AdminService {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async findAll() {
    try {
      const result = await this.pool.query(
        `SELECT admin_id, admin_name, email, phone, customer_address, 
        dob, created_at FROM admins`,
      );

      const data = result.rows;

      const adminDataNoPasswordArray: AdminResponseDto[] = data.map(
        (admin) => ({
          admin_id: admin.admin_id,
          admin_name: admin.admin_name,
          email: admin.email,
          phone: admin.phone,
          customer_address: admin.customer_address,
          dob: admin.dob,
          created_at: admin.created_at,
        }),
      );

      return adminDataNoPasswordArray;
    } catch (error) {
      console.error('Error fetching admins:', error);
      throw error;
    }
  }

  async findOne(adminId: number) {
    try {
      const result = await this.pool.query(
        `SELECT admins.admin_id, admins.admin_name, admins.email, 
        admins.phone, admins.customer_address, admins.dob, 
        admins.created_at FROM admins WHERE admin_id = $1`,
        [adminId],
      );

      if (!result.rows.length) {
        throw new NotFoundException('Admin not found');
      }

      const data = result.rows[0];

      const adminDataNoPassword: AdminResponseDto = {
        admin_id: data.admin_id,
        admin_name: data.admin_name,
        email: data.email,
        phone: data.phone,
        customer_address: data.customer_address,
        dob: data.dob,
        created_at: data.created_at,
      };

      return adminDataNoPassword;
    } catch (error) {
      console.error('Error fetching admin:', error);
      throw error;
    }
  }

  async create(createAdminDto: CreateAdminDto) {
    const { admin_name, email, password, phone, customer_address, dob } =
      createAdminDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const newAdmin = await this.pool.query(
        `INSERT INTO admins (admin_name, email, password, phone, customer_address, dob) VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING admin_id, admin_name, email, phone, customer_address, dob, created_at`,
        [admin_name, email, hashedPassword, phone, customer_address, dob],
      );

      if (!newAdmin.rows.length) {
        throw new BadRequestException('Failed to create Admin');
      }

      return newAdmin.rows[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async update(adminId: number, updateAdminDto: UpdateAdminDto) {
    const fields: string[] = [];
    const values: any[] = [];
    let index = 1;

    for (const [key, value] of Object.entries(updateAdminDto)) {
      if (value !== undefined) {
        fields.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
    }

    if (fields.length === 0) {
      throw new BadRequestException('No fields to update');
    }

    values.push(adminId);

    const query = `
    UPDATE admins
    SET ${fields.join(', ')}
    WHERE admin_id = $${index}
    RETURNING admin_id, admin_name, email, phone, customer_address, dob, created_at
  `;

    try {
      const result = await this.pool.query(query, values);

      if (!result.rows.length) {
        throw new NotFoundException('Error, Admin not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error updating admin`s info', error);
      throw error;
    }
  }

  async updatePassword(
    adminId: number,
    updatePasswordAdminDto: UpdatePasswordAdminDto,
  ) {
    try {
      const result = await this.pool.query(
        `SELECT admins.password FROM admins WHERE admin_id = $1`,
        [adminId],
      );

      const admin = result.rows[0];

      // if (updatePasswordDto.oldPassword !== admin.oldPassword) {
      //   throw new Error('Old password does not match');
      // }

      if (!admin) {
        throw new NotFoundException('Admin not found');
      }

      const isMatch = await bcrypt.compare(
        updatePasswordAdminDto.oldPassword,
        admin.password,
      );

      if (!isMatch) {
        throw new BadRequestException('Old password is incorrect');
      }

      const hashedPassword = await bcrypt.hash(
        updatePasswordAdminDto.newPassword,
        10,
      );

      await this.pool.query(
        `UPDATE admins SET password = $1 WHERE admin_id = $2`,
        [hashedPassword, adminId],
      );

      return { message: 'Password updated successfully' };
    } catch (error) {
      console.error('Error updating admin password', error);
      throw error;
    }
  }

  async remove(adminId: number) {
    try {
      const result = await this.pool.query(
        `DELETE FROM admins WHERE admin_id = $1 RETURNING *;`,
        [adminId],
      );

      if (!result.rowCount) {
        throw new NotFoundException('Admin not found');
      }

      return { message: 'Admin deleted successfully' };
    } catch (error) {
      console.error('Error deleting Admin:', error);
      throw error;
    }
  }
}
