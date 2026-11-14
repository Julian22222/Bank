import { AdminCreate } from '../../../shared/types/adminCreate.interface';

export const allAdmins: AdminCreate[] = [
  {
    admin_name: 'Sam',
    role: 'admin',
    email: 'sam@admin.com',
    password: '$2b$10$CBMBY/pEjOv4Uq.KK1zGX..Aeceq1v0PGu92qXw72xogjG.1qUNe2',
    phone: '+447835473879',
    customer_address: 'Manchester, 156 Manchester Road',
    dob: '1995-06-15',
  },
  {
    admin_name: 'Jack',
    role: 'superAdmin',
    email: 'jack@superadmin.com',
    password: '$2b$10$CBMBY/pEjOv4Uq.KK1zGX..Aeceq1v0PGu92qXw72xogjG.1qUNe2',
    phone: '+447835473880',
    customer_address: 'Manchester, 156 Manchester Road',
    dob: '1997-08-19',
  },
];
