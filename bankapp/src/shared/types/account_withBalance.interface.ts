export interface AccountWithBalance {
  account_id?: number;
  customer_id: number;
  account_type: string;
  account_nr: string;
  status: string;
  overdraft_limit: number;
  created_at: string;
  balance: number;
}
