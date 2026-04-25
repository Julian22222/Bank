import { User } from 'types/user.type';

export const allusers: User[] = [
  {
    first_name: 'Julian',
    last_name: 'Golovens',
    email: 'julian@test.com',
    password: 'Iw2jbiKQtDlm9dqV3H3fOu35UJbG85Gw50aEjIIoSwW8xhNn8nusC',
    phone: '+447892828658',
    customer_address: '123 Main St, Springfield, IL',
    dob: new Date('1995-06-15'),
  },
  {
    first_name: 'Tom',
    last_name: 'Simpsons',
    email: 'tomsimpson@test.com',
    password: '$2b$10$yI33zf9VaPsT3ydsJUznFu9VIuDe.4M9xEg7F/Juy9yFxNeSoLeDq',
    phone: '+447892828655',
    customer_address: '456 Main St, Springfield, IL',
    dob: new Date('1985-06-15'),
  },
];
