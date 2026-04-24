export const mockAccountsService = {
  findAll: jest.fn().mockReturnValue([
    {
      accont_id: 1,
      customer_id: 1,
      account_type: 'Main',
      account_nr: '12-34-56 / 98765432',
    },
    {
      accont_id: 2,
      customer_id: 1,
      account_type: 'Saver',
      account_nr: '98-76-54 / 12345678',
    },
    {
      accont_id: 3,
      customer_id: 2,
      account_type: 'Main',
      account_nr: '11-22-33 / 11223344',
    },
  ]),

  getAllAccountsCustomers: jest.fn().mockReturnValue([
    {
      account_id: 1,
      customer_id: 1,
      account_type: 'Main',
      account_nr: '12-34-56 / 98765432',
      created_at: '2026-04-13T18:40:52.189Z',
      first_name: 'Julian',
      last_name: 'Golovens',
      email: 'julian@test.com',
      phone: '123-456-7890',
      customer_address: '123 Main St, Springfield, IL',
      dob: '1995-06-15T00:00:00.000Z',
    },
    {
      account_id: 2,
      customer_id: 1,
      account_type: 'Saver',
      account_nr: '98-76-54 / 12345678',
      created_at: '2026-04-13T18:40:52.191Z',
      first_name: 'Julian',
      last_name: 'Golovens',
      email: 'julian@test.com',
      phone: '123-456-7890',
      customer_address: '123 Main St, Springfield, IL',
      dob: '1995-06-15T00:00:00.000Z',
    },
  ]),

  findUserAccountAndBalance: jest.fn().mockReturnValue({
    accont_id: 1,
    customer_id: 1,
    account_type: 'Main',
    account_nr: '12-34-56 / 98765432',
    balance: 2253.93,
  }),

  findOne: jest.fn().mockReturnValue([
    {
      accont_id: 1,
      customer_id: 1,
      account_type: 'Main',
      account_nr: '12-34-56 / 98765432',
    },
    {
      customer_id: 1,
      account_type: 'Saver',
      account_nr: '98-76-54 / 12345678',
    },
  ]),

  create: jest.fn().mockReturnValue({
    account_id: 4,
    customer_id: 2,
    account_type: 'Saver',
    account_nr: '01-20-88 / 98765432',
  }),

  update: jest.fn().mockReturnValue({
    account_id: 3,
    customer_id: 2,
    account_type: 'Main',
    account_nr: '11-22-33 / 11223344',
  }),

  remove: jest.fn().mockReturnValue('Account deleted successfully'),
};
