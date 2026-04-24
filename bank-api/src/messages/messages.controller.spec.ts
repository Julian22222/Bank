import { Test, TestingModule } from '@nestjs/testing';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { mockMessagesService } from './messages.controller.mock';

describe('MessagesController', () => {
  let controller: MessagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessagesController],
      providers: [{ provide: MessagesService, useValue: mockMessagesService }],
    }).compile();

    controller = module.get<MessagesController>(MessagesController);
  });

  it('Test 1: should GET all messages', async () => {
    const allMessages = [
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
    ];

    expect(await controller.findAll()).toEqual(allMessages);
  });

  it('Test 2: should GET 1 message and return this new message', async () => {
    const allMessages = {
      message_id: 1,
      customer_id: 1,
      msg_subject: 'new account',
      msg_status: 'common',
      msg_body: 'Welcome to Big Bank',
      msg_created_by: 'Anthony',
      sent_at: '2026-04-21 19:12:55.863',
    };

    const messageId = 1;

    expect(await controller.findOne(messageId)).toEqual(allMessages);
  });

  it('Test 3: should CREATE a new message and return this new message', async () => {
    const newMsg = {
      customer_id: 1,
      msg_subject: 'Bank account',
      msg_status: 'urgent',
      msg_body: 'test body',
      msg_created_by: 'Johny',
    };

    expect(await controller.create(newMsg)).toEqual({
      customer_id: 1,
      msg_subject: 'Bank account',
      msg_status: 'urgent',
      msg_body: 'test body',
      msg_created_by: 'Johny',
    });
  });

  it('Test 2:should UPDATE a user`s message and return updated message', async () => {
    const messageId = 1;
    const updatedMsg = {
      msg_body: 'updated body',
    };

    expect(await controller.update(messageId, updatedMsg)).toEqual({
      customer_id: 1,
      msg_subject: 'Bank account',
      msg_status: 'urgent',
      msg_body: 'updated body',
      msg_created_by: 'Johny',
    });
  });

  it('Test 3: should REMOVE message and return text - Message deleted successfully', async () => {
    const messageId = 2;

    expect(await controller.remove(messageId)).toEqual({
      message: 'Message deleted successfully',
    });
  });
});
