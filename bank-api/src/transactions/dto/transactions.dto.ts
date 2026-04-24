export class TransactionDto {
  transaction_id: number;
  account_id: number;
  customer_id: number;
  money_amount: number; // DECIMAL
  balance: number; // DECIMAL
  details: string;
  transaction_date: string;
}
