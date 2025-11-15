import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { allusers } from '../../data/users.data';
const pool = require('../../data/dbconnection');

@Injectable()
export class UsersService {
  async findAll() {
    // return allusers;

    // Alternatively, to fetch all users from the database:
    try {
      //pool.query() is async → returns a Promise
      //await makes the code wait until the Promise is resolved
      //MUST use async await to get the result of the query

      const allUsersFromDB = await pool.query(`SELECT * FROM customers`);

      return allUsersFromDB.rows;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async findOne(id: number) {
    // const user = allusers.find((user) => user.id === id);
    // return user;

    // Alternatively, to fetch a single user from the database by ID:
    try {
      const userFromDB = await pool.query(
        `SELECT * FROM customers WHERE customer_id = $1`,
        [id],
      );
      return userFromDB.rows[0];
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  create(createUserDto: CreateUserDto) {
    // const newUser = { ...createUserDto, id: allusers.length + 1 };
    // allusers.push(newUser);
    // return newUser;

    const {
      first_name,
      last_name,
      email,
      password,
      phone,
      customer_address,
      dob,
    } = createUserDto;

    // Alternatively, to insert a new user into the database:
    try {
      const newUser = pool.query(
        `INSERT INTO customers (first_name, last_name, email, password, phone, customer_address, dob) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
        [first_name, last_name, email, password, phone, customer_address, dob],
      );
      //use RETURNING * to get the newly created user record
      //you only need RETURNING * when you want PostgreSQL to give you back the inserted (or updated/deleted) row immediately after the query.
      //Use RETURNING * --> with INSERT, UPDATE, or DELETE statements if you want to see what was affected.
      //DON'T use RETURNING * --> with SELECT statements.

      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // const correctUser = allusers.map((user) => {
    //   if (user.id === id) {
    //     return { ...user, ...updateUserDto };
    //                                               // Merge the existing user data with the updated data, Since both objects have the same properties, the values from updateUserDto replace the ones from user. User object has id property which is not present in updateUserDto.
    //                                               // Return the updated user object
    //   }
    //   return user;
    // });

    // Alternatively, to update the user into the database:
    const {
      first_name,
      last_name,
      email,
      password,
      phone,
      customer_address,
      dob,
    } = updateUserDto;

    const newUser = await pool.query(
      `UPDATE customers SET first_name = $1, last_name = $2, email = $3, password = $4, phone = $5, customer_address = $6, dob = $7 WHERE customer_id = $8 RETURNING *;`,
      [
        first_name,
        last_name,
        email,
        password,
        phone,
        customer_address,
        dob,
        id,
      ],
    );

    return newUser.rows[0];
  }

  remove(id: number) {
    //   const index = allusers.findIndex((user) => user.id === id);

    //   allusers.splice(index, 1); // Remove the user at the found index from the allusers array

    //   return 'User removed successfully';
    // }

    // Alternatively, delete the user from the database:

    try {
      const deletedUser = pool.query(
        `DELETE FROM customers WHERE customer_id = $1 RETURNING *;`,
        [id],
      );

      return 'User removed successfully';
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}
