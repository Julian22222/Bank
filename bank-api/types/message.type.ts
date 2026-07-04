export type Message = {
  message_id?: number;
  customer_id: number;
  msg_subject: string;
  msg_status: string;
  msg_body: string;
  msg_created_by: string;
  is_read: boolean;
  sent_at?: string;
};
