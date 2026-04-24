export const mockAdminService = {
  findAll: jest.fn().mockReturnValue([
    {
      admin_id: 1,
      admin_name: 'Sam',
      email: 'Sam@admin.com',
      phone: '123456789',
      customer_address: 'Manchester, 156 Manchester Road',
      dob: '1995-06-15',
      created_at: '2026-04-20 20:53:22.314',
    },
  ]),

  findOne: jest.fn().mockReturnValue({
    admin_id: 1,
    admin_name: 'Sam',
    email: 'Sam@admin.com',
    phone: '123456789',
    customer_address: 'Manchester, 156 Manchester Road',
    dob: '1995-06-15',
    created_at: '2026-04-20 20:53:22.314',
  }),

  create: jest.fn().mockReturnValue({
    admin_id: 2,
    admin_name: 'Tom',
    email: 'tom.doe@example.com',
    phone: '123456789',
    customer_address: 'Leeds, UK',
    dob: '1995-01-01',
    created_at: '2026-04-20 20:53:22.314',
  }),

  update: jest.fn().mockReturnValue({
    admin_id: 1,
    admin_name: 'Billy',
    email: 'billy"test.com',
    phone: '123456789',
    customer_address: 'address test',
    dob: '1993-01-01',
    created_at: '2026-04-20 20:53:22.314',
  }),

  updatePassword: jest.fn().mockReturnValue({
    message: 'Password updated successfully',
  }),

  remove: jest.fn().mockReturnValue({
    message: 'Admin deleted successfully',
  }),

  // sendMessageToUser: jest.fn().mockReturnValue({
  //   customer_id: 1,
  //   msg_subject: 'Bank account',
  //   msg_status: 'urgent',
  //   msg_body: 'test body',
  //   msg_created_by: 'Johny',
  // }),

  // updateMessage: jest.fn().mockReturnValue({
  //   customer_id: 1,
  //   msg_subject: 'Bank account',
  //   msg_status: 'urgent',
  //   msg_body: 'updated body',
  //   msg_created_by: 'Johny',
  // }),

  // removeMessage: jest.fn().mockReturnValue({
  //   message: 'Message deleted successfully',
  // }),
};
