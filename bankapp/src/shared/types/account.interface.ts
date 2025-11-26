export interface Account {
  account_id?: number;
  customer_id: number;
  account_type: string;
  account_nr: string;
  balance: number; // DECIMAL
}
