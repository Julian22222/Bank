export interface Transaction {
  account_id: number;
  customer_id: number;
  money_amount: string; // DECIMAL
  balance: string; // DECIMAL
  details: string;
  transaction_date?: string; // DATE
}
