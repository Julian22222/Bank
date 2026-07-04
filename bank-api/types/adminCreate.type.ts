export type AdminCreate = {
  admin_id?: number;
  admin_name: string;
  email: string;
  password: string;
  phone: string;
  customer_address: string;
  dob: string;
  created_at?: string;
};
