export interface Account {
  transaction_date: string;
  account_id?: number;
  customer_id: number;
  account_type: string;
  account_nr: string;
  balance: number; // DECIMAL
}
