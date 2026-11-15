import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  // ///////////// local postgreSQL database details
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_DATABASE,

  //ssl block to seed to AWS only
  ssl: {
    rejectUnauthorized: false,
  },
});
