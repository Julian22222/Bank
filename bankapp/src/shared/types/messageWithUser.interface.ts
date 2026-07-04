export interface MessageWithUser {
  message_id?: number;
  customer_id: number;
  msg_subject: string;
  msg_status: string;
  msg_body: string;
  msg_created_by: string;
  is_read: boolean;
  sent_at?: string;
  first_name?: string;
  last_name?: string;
  dob?: string;
}
