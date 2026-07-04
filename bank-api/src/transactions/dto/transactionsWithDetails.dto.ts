export interface TransactionWithDetailsDto {
  transaction_id?: number;
  account_id: number;
  customer_id: number;
  money_amount: number; // DECIMAL
  balance: number; // DECIMAL
  transaction_date?: string; // DATE
  details: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  customer_address: string;
  dob: string;
  account_type: string;
}
