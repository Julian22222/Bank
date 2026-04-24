export const mockMessagesService = {
  findAll: jest.fn().mockReturnValue([
    {
      message_id: 1,
      customer_id: 1,
      msg_subject: 'new account',
      msg_status: 'common',
      msg_body: 'Welcome to Big Bank',
      msg_created_by: 'Anthony',
      sent_at: '2026-04-21 19:12:55.863',
    },
    {
      message_id: 2,
      customer_id: 2,
      msg_subject: 'new account',
      msg_status: 'common',
      msg_body: 'Welcome to Big Bank',
      msg_created_by: 'Tom',
      sent_at: '2026-04-15 19:12:55.863',
    },
  ]),

  findOne: jest.fn().mockReturnValue({
    message_id: 1,
    customer_id: 1,
    msg_subject: 'new account',
    msg_status: 'common',
    msg_body: 'Welcome to Big Bank',
    msg_created_by: 'Anthony',
    sent_at: '2026-04-21 19:12:55.863',
  }),

  create: jest.fn().mockReturnValue({
    customer_id: 1,
    msg_subject: 'Bank account',
    msg_status: 'urgent',
    msg_body: 'test body',
    msg_created_by: 'Johny',
  }),

  update: jest.fn().mockReturnValue({
    customer_id: 1,
    msg_subject: 'Bank account',
    msg_status: 'urgent',
    msg_body: 'updated body',
    msg_created_by: 'Johny',
  }),

  remove: jest.fn().mockReturnValue({
    message: 'Message deleted successfully',
  }),
};
