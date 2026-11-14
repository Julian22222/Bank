export interface ISaverAccountType {
  saving_id?: number;
  account_name: string;
  interest: number;
  money_limit: number;
  account_duration: number;
  created_at?: string;
}
