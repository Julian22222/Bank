import { Account } from 'types/account.type';
import { Transaction } from 'types/transaction.type';
import { User } from 'types/user.type';
import { allusers } from './test-data/users.data';
import { transactions } from './test-data/transactions.data';
import { allAccounts } from './test-data/accounts.data';
import { allAdmins } from './test-data/admins.data';

type Props = {
  allusers: User[];
  transactions: Transaction[];
  allAccounts: Account[];
};

const seed = async ({ allusers, transactions, allAccounts }: Props) => {
  console.log('Seeding started...');

  const pool = require('./dbconnection');

  try {
    await pool.query(`DROP TABLE IF EXISTS messages;`);
    await pool.query(`DROP TABLE IF EXISTS admins;`);
    await pool.query(`DROP TABLE IF EXISTS transactions;`);
    await pool.query(`DROP TABLE IF EXISTS accounts;`);
    await pool.query(`DROP TABLE IF EXISTS customers;`);

    const createCustomersTable = await pool.query(`
        CREATE TABLE customers (
        customer_id SERIAL PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(15) NOT NULL,
        customer_address VARCHAR(255) NOT NULL,
        dob DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    const createAccountsTable = await pool.query(`
        CREATE TABLE accounts (
        account_id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES customers(customer_id),
        account_type VARCHAR(20) NOT NULL,
        account_nr VARCHAR(30) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    const createTransactionsTable = await pool.query(`
        CREATE TABLE transactions (
        transaction_id SERIAL PRIMARY KEY,
        account_id INTEGER REFERENCES accounts(account_id),
        customer_id INTEGER REFERENCES customers(customer_id),
        money_amount DECIMAL(10, 2) NOT NULL DEFAULT 200.00,
        balance DECIMAL(10, 2) NOT NULL DEFAULT 200.00,
        details TEXT,               
        transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`);

    const createAdminsTable = await pool.query(`
        CREATE TABLE admins (
        admin_id SERIAL PRIMARY KEY,
        admin_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(15) NOT NULL,
        customer_address VARCHAR(255) NOT NULL,
        dob DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    const createMessagesTable = await pool.query(`
        CREATE TABLE messages (
        message_id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES customers(customer_id),
        msg_subject VARCHAR(255) NOT NULL,
        msg_status VARCHAR(50) NOT NULL,
        msg_body TEXT NOT NULL,
        msg_created_by VARCHAR(50) NOT NULL,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`);

    for (const user of allusers) {
      await pool.query(
        `INSERT INTO customers (first_name, last_name, email, password, phone, customer_address, dob) 
                VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          user.first_name,
          user.last_name,
          user.email,
          user.password,
          user.phone,
          user.customer_address,
          user.dob,
        ],
      );
    }

    for (const admin of allAdmins) {
      await pool.query(
        `INSERT INTO admins (admin_name, email, password, phone, customer_address, dob) 
                VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          admin.admin_name,
          admin.email,
          admin.password,
          admin.phone,
          admin.customer_address,
          admin.dob,
        ],
      );
    }

    for (const account of allAccounts) {
      await pool.query(
        `INSERT INTO accounts (customer_id, account_type, account_nr) 
                VALUES ($1, $2, $3)`,
        [account.customer_id, account.account_type, account.account_nr],
      );
    }

    for (const transaction of transactions) {
      await pool.query(
        `INSERT INTO transactions (account_id, customer_id, money_amount, balance, details) 
                VALUES ($1, $2, $3, $4, $5)`,
        [
          transaction.account_id,
          transaction.customer_id,
          transaction.money_amount,
          transaction.balance,
          transaction.details,
        ],
      );
    }

    console.log('Data seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    pool.end();
  }
};

seed({ allusers, transactions, allAccounts });

export default seed;
