import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { MessagesService } from '../src/messages/messages.service';

describe('MessagesController (e2e)', () => {
  let app: INestApplication;

  const mockMessagesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MessagesService)
      .useValue(mockMessagesService)
      .compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  // =========================
  // ✅ GET ALL MESSAGES → 200
  // =========================
  it('GET /messages → 200', async () => {
    const mockData = [
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

    mockMessagesService.findAll.mockResolvedValue(mockData);

    await request(app.getHttpServer())
      .get('/messages')
      .expect(200)
      .expect(mockData);
  });

  // =========================
  // ✅ GET ONE MESSAGES → 200
  // =========================
  it('GET /messages/1 → 200', async () => {
    const mockMessage = {
      message_id: 1,
      customer_id: 1,
      msg_subject: 'new account',
      msg_status: 'common',
      msg_body: 'Welcome to Big Bank',
      msg_created_by: 'Anthony',
      sent_at: '2026-04-21 19:12:55.863',
    };

    mockMessagesService.findOne.mockResolvedValue(mockMessage);

    await request(app.getHttpServer())
      .get('/messages/1')
      .expect(200)
      .expect(mockMessage);
  });

  //   // =========================
  //   // ❌ GET ONE MESSAGE → 404
  //   // =========================
  it('GET /messages/999 → 404', async () => {
    mockMessagesService.findOne.mockRejectedValue(
      new NotFoundException('Message not found'),
    );

    await request(app.getHttpServer()).get('/messages/999').expect(404);
  });

  //   // =========================
  //   // ✅ CREATE MESSAGE → 201
  //   // =========================
  it('POST /messages → 201', async () => {
    const newMessage = {
      customer_id: 1,
      msg_subject: 'Bank account',
      msg_status: 'urgent',
      msg_body: 'test body',
      msg_created_by: 'Johny',
    };

    mockMessagesService.create.mockResolvedValue({
      message_id: 2,
      ...newMessage,
      sent_at: '2026-04-20 20:53:22.314',
    });

    await request(app.getHttpServer())
      .post('/messages')
      .send(newMessage)
      .expect(201)
      .expect({
        message_id: 2,
        ...newMessage,
        sent_at: '2026-04-20 20:53:22.314',
      });
  });

  //   // =========================
  //   // ❌ CREATE MESSAGE → 400
  //   // =========================
  it('POST /messages → 400 (validation error)', async () => {
    await request(app.getHttpServer())
      .post('/messages')
      .send({
        customer_id: '1', //invalid
        msg_subject: 'Bank account',
        msg_status: 'urgent',
        msg_body: 'test body',
        msg_created_by: 'Johny',
      })
      .expect(400);
  });

  //   // =========================
  //   // ✅ PATCH /messages/:id → 200
  //   // =========================
  it('PATCH /messages/1 → 200', async () => {
    const updatedMessage = {
      msg_subject: 'Bank account',
      msg_status: 'urgent',
      msg_body: 'test body',
      msg_created_by: 'Mike',
    };

    mockMessagesService.update.mockResolvedValue({
      message_id: 1,
      customer_id: 1,
      ...updatedMessage,
      sent_at: '2026-04-20 20:53:22.314',
    });

    await request(app.getHttpServer())
      .patch('/messages/1')
      .send(updatedMessage)
      .expect(200)
      .expect({
        message_id: 1,
        customer_id: 1,
        ...updatedMessage,
        sent_at: '2026-04-20 20:53:22.314',
      });
  });

  //   // =========================
  //   // ❌ PATCH /messages/:id → 404
  //   // =========================
  it('PATCH /users/999 → 404', async () => {
    mockMessagesService.update.mockRejectedValue(
      new NotFoundException('Message not found'),
    );

    await request(app.getHttpServer())
      .patch('/messages/999')
      .send({})
      .expect(404);
  });

  //   // =========================
  //   // ✅ DELETE /messages/:id → 200
  //   // =========================
  it('DELETE /usemessagesrs/1 → 200', async () => {
    mockMessagesService.remove.mockResolvedValue(
      'Message deleted successfully',
    );

    await request(app.getHttpServer())
      .delete('/messages/1')
      .expect(200)
      .expect('Message deleted successfully');
  });

  //   // =========================
  //   // ❌ DELETE /messages/:id → 404
  //   // =========================
  it('DELETE /messages/999 → 404', async () => {
    mockMessagesService.remove.mockRejectedValue(
      new NotFoundException('Message not found'),
    );

    await request(app.getHttpServer()).delete('/messages/999').expect(404);
  });
});
