export class CreateStatementDto {
  account_id: number;
  customer_id: number;
  money_amount: string; // DECIMAL
  balance: string; // DECIMAL
  transaction_date?: string; // DATE
  details: string;
}
