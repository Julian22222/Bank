import { User } from 'types/user';

export const allusers: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'JohnDoe@test.com',
    password: 'hashedpassword123',
    address: '123 Main St, Anytown, USA',
    phoneNumber: '555-1234',
    dob: new Date('1990-01-01'),
  },
  {
    id: 2,
    name: 'Tom Smith',
    email: 'TomSmith"@test.com',
    password: 'hashedpassword456',
    address: '456 Elm St, Othertown, USA',
    phoneNumber: '555-5678',
    dob: new Date('1985-05-15'),
  },
];
