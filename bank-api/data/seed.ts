import { IAccount } from '../../shared/types/account.interface';
import { ITransaction } from '../../shared/types/transaction.interface';
import { ICreateUser } from '../../shared/types/createNewUser.interface';
import { allusers } from './test-data/users.data';
import { transactions } from './test-data/transactions.data';
import { allAccounts } from './test-data/accounts.data';
import { allAdmins } from './test-data/admins.data';
import { allMessages } from './test-data/messages.data';
import { newUsersRegisteration } from './test-data/newUserRegistration.data';
import { allSaverBankAccountTypes } from './test-data/saverBankAccounts.data';

type Props = {
  allusers: ICreateUser[];
  transactions: ITransaction[];
  allAccounts: IAccount[];
};

const seed = async ({ allusers, transactions, allAccounts }: Props) => {
  console.log('Seeding started...');

  const pool = require('./dbconnection');

  try {
    await pool.query(`DROP TABLE IF EXISTS bank_saver_account_types;`);
    await pool.query(`DROP TABLE IF EXISTS registration;`);
    await pool.query(`DROP TABLE IF EXISTS messages;`);
    await pool.query(`DROP TABLE IF EXISTS admins;`);
    await pool.query(`DROP TABLE IF EXISTS transactions;`);
    await pool.query(`DROP TABLE IF EXISTS accounts;`);
    await pool.query(`DROP TABLE IF EXISTS customers;`);
    await pool.query(`DROP TABLE IF EXISTS email_verifications;`);

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
        phone_verified BOOLEAN DEFAULT FALSE,
        email_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        failed_login_attempts INT NOT NULL DEFAULT 0,
        account_locked_until TIMESTAMPTZ DEFAULT NULL
      );
    `);

    const createAccountsTable = await pool.query(`
      CREATE TABLE accounts (
        account_id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES customers(customer_id),
        account_type VARCHAR(20) NOT NULL,
        account_nr VARCHAR(30) NOT NULL UNIQUE,
        status VARCHAR(20) DEFAULT 'active',
        overdraft_limit DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
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
        transaction_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const createAdminsTable = await pool.query(`
      CREATE TABLE admins (
        admin_id SERIAL PRIMARY KEY,
        role VARCHAR(30) NOT NULL,
        admin_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(15) NOT NULL,
        customer_address VARCHAR(255) NOT NULL,
        dob DATE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
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
        flagged BOOLEAN DEFAULT FALSE,
        is_read BOOLEAN DEFAULT FALSE,
        sent_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const createNewUsersRegistrationTable = await pool.query(`
      CREATE TABLE registration (
        registration_id SERIAL PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(15) NOT NULL,
        customer_address VARCHAR(255) NOT NULL,
        dob DATE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const createBankSaverAccountTypesTable = await pool.query(`
      CREATE TABLE bank_saver_account_types (
        saving_id SERIAL PRIMARY KEY,
        account_name VARCHAR(100) NOT NULL,
        interest DECIMAL(5, 2) NOT NULL,
        money_limit DECIMAL(10, 2) NOT NULL,
        account_duration INTEGER NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const createEmailVerificationTable = await pool.query(`
      CREATE TABLE email_verifications (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
        token_hash CHAR(64) NOT NULL UNIQUE,
        expires_at TIMESTAMPTZ NOT NULL,
        used_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE INDEX idx_email_verifications_customer ON email_verifications(customer_id);
    `);

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
        `INSERT INTO admins (admin_name, role, email, password, phone, customer_address, dob) 
                VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          admin.admin_name,
          admin.role,
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

    for (const message of allMessages) {
      await pool.query(
        `INSERT INTO messages (customer_id, msg_subject, msg_status, msg_body, msg_created_by) 
          VALUES ($1, $2, $3, $4, $5)`,
        [
          message.customer_id,
          message.msg_subject,
          message.msg_status,
          message.msg_body,
          message.msg_created_by,
        ],
      );
    }

    for (const newuser of newUsersRegisteration) {
      await pool.query(
        `INSERT INTO registration (registration_id, first_name, last_name, email, phone, customer_address, dob) 
          VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          newuser.registration_id,
          newuser.first_name,
          newuser.last_name,
          newuser.email,
          newuser.phone,
          newuser.customer_address,
          newuser.dob,
        ],
      );
    }

    for (const saverAccount of allSaverBankAccountTypes) {
      await pool.query(
        `INSERT INTO bank_saver_account_types (saving_id, account_name, interest, money_limit, account_duration, created_at) 
          VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          saverAccount.saving_id,
          saverAccount.account_name,
          saverAccount.interest,
          saverAccount.money_limit,
          saverAccount.account_duration,
          saverAccount.created_at,
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
