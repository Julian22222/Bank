export const mockUsersService = {
  findAll: jest.fn().mockReturnValue([
    {
      customer_id: 1,
      first_name: 'Julian',
      last_name: 'Golovens',
      email: 'julian@test.com',
      phone: '123-456-7890',
      customer_address: '123 Main St, Springfield, IL',
      dob: new Date('1995-06-15'),
      created_at: '2026-04-20 20:53:22.314',
    },
    {
      customer_id: 2,
      first_name: 'Tom',
      last_name: 'Simpsons',
      email: 'tomSimpson@gmail.com',
      phone: '123-456-7890',
      customer_address: '456 Main St, Springfield, IL',
      dob: new Date('1985-06-15'),
      created_at: '2025-04-20 20:53:22.314',
    },
  ]),

  findOne: jest.fn().mockReturnValue({
    customer_id: 1,
    first_name: 'Julian',
    last_name: 'Golovens',
    email: 'julian@test.com',
    phone: '123-456-7890',
    customer_address: '123 Main St, Springfield, IL',
    dob: new Date('1995-06-15'),
    created_at: '2026-04-20 20:53:22.314',
  }),

  create: jest.fn().mockReturnValue({
    customer_id: 3,
    first_name: 'Bill',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    phone: '123456789',
    customer_address: 'Manchester, UK',
    dob: new Date('1990-01-01'),
    created_at: '2026-04-20 20:53:22.314',
  }),

  update: jest.fn().mockReturnValue({
    customer_id: 3,
    first_name: 'Bill',
    last_name: 'McDoe',
    email: 'john.doe@example.com',
    phone: '123456789',
    customer_address: 'Manchester, UK',
    dob: new Date('1990-01-01'),
    created_at: '2026-04-20 20:53:22.314',
  }),

  remove: jest.fn().mockReturnValue('User removed successfully'),
};
