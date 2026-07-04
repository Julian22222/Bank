export interface IUserWithAccount {
  customer_id?: number;
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  phone: string;
  customer_address: string;
  dob: string;
  phoneVerified?: boolean;
  emailVerified?: boolean;
  created_at?: string;
  account_id?: number;
  account_type?: string;
  account_nr?: string;
  status?: string;
  overdraft_limit?: number;
}
