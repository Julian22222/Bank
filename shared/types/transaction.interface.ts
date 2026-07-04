export interface ITransaction {
  transaction_id?: number;
  account_id: number;
  customer_id: number;
  money_amount: number; // DECIMAL
  balance: number; // DECIMAL
  transaction_date?: string; // DATE
  details: string;
}
