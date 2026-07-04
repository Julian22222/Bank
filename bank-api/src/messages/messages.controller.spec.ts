import { Test, TestingModule } from '@nestjs/testing';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { mockMessagesService } from './messages.controller.mock';

describe('MessagesController', () => {
  let controller: MessagesController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [MessagesController],
      providers: [{ provide: MessagesService, useValue: mockMessagesService }],
    }).compile();

    controller = module.get<MessagesController>(MessagesController);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await module.close();
  });

  describe('findAll', () => {
    it('should return all messages', async () => {
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
  });

  describe('findOne', () => {
    it('should return one message', async () => {
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

      const result = await controller.findOne(messageId);

      expect(result).toEqual(allMessages);
      expect(mockMessagesService.findOne).toHaveBeenCalledWith(messageId);
      expect(result.message_id).toBe(messageId);
    });

    it('should throw if message is not found', async () => {
      mockMessagesService.findOne.mockRejectedValue(
        new Error('Message not found'),
      );
      await expect(controller.findOne(999)).rejects.toThrow(
        'Message not found',
      );
    });
  });

  describe('create', () => {
    it('should CREATE a new message and return it', async () => {
      const newMsg = {
        customer_id: 1,
        msg_subject: 'Bank account',
        msg_status: 'urgent',
        msg_body: 'test body',
        msg_created_by: 'Johny',
      };

      const result = await controller.create(newMsg);

      expect(result).toEqual({
        customer_id: 1,
        msg_subject: 'Bank account',
        msg_status: 'urgent',
        msg_body: 'test body',
        msg_created_by: 'Johny',
      });

      expect(mockMessagesService.create).toHaveBeenCalledWith(newMsg);
      expect(result.msg_body).toBe('test body');
      expect(result.msg_subject).toBe('Bank account');
    });

    it('should throw if create fails', async () => {
      mockMessagesService.create.mockRejectedValue(new Error('Create failed'));
      await expect(controller.create({} as any)).rejects.toThrow(
        'Create failed',
      );
    });
  });

  describe('update', () => {
    it('should UPDATE a message and return it', async () => {
      const messageId = 1;
      const updatedMsg = {
        msg_body: 'updated body',
      };

      const result = await controller.update(messageId, updatedMsg);

      expect(result).toEqual({
        customer_id: 1,
        msg_subject: 'Bank account',
        msg_status: 'urgent',
        msg_body: 'updated body',
        msg_created_by: 'Johny',
      });

      expect(mockMessagesService.update).toHaveBeenCalledWith(
        messageId,
        updatedMsg,
      );
      expect(result.msg_body).toBe('updated body');
    });

    it('should throw if update fails', async () => {
      mockMessagesService.update.mockRejectedValue(new Error('Update failed'));
      await expect(controller.update(1, {} as any)).rejects.toThrow(
        'Update failed',
      );
    });
  });

  describe('remove', () => {
    it('should REMOVE message and return text - Message deleted successfully', async () => {
      const messageId = 2;

      const result = await controller.remove(messageId);

      expect(mockMessagesService.remove).toHaveBeenCalledWith(messageId);
      expect(mockMessagesService.remove).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();

      expect(result).toEqual({
        message: 'Message deleted successfully',
      });
    });
  });
});
