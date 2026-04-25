import { User } from 'types/user.type';

export const allusers: User[] = [
  {
    first_name: 'Julian',
    last_name: 'Golovens',
    email: 'julian@test.com',
    password: '123456',
    phone: '+447892828658',
    customer_address: '123 Main St, Springfield, IL',
    dob: new Date('1995-06-15'),
  },
  {
    first_name: 'Tom',
    last_name: 'Simpsons',
    email: 'tomSimpson@gmail.com',
    password: '234567',
    phone: '+447892828655',
    customer_address: '456 Main St, Springfield, IL',
    dob: new Date('1985-06-15'),
  },
];
