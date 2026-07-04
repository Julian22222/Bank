import { ICreateUser } from '../../../shared/types/createNewUser.interface';

export const allusers: ICreateUser[] = [
  {
    first_name: 'Julian',
    last_name: 'Golovens',
    email: 'julik.golovenj@gmail.com',
    password: '$2b$10$4qZWJviWncUfQN8yG0iOTuFRJxEmSrbNtwkp6nAIM7dPA4DBzvTUC',
    phone: '+447892828653',
    customer_address: '123 Main Road, Manchester',
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
