import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe, BadRequestException } from '@nestjs/common';

jest.mock('@nestjs/schedule', () => ({
  ScheduleModule: {
    forRoot: jest.fn(() => ({ module: class MockScheduleModule {} })),
  },
  Cron: jest.fn(),
}));

import { AppModule } from '../src/app.module';
import { EmailVerificationService } from '../src/email-verification/email-verification.service';

describe('EmailVerificationController (e2e)', () => {
  let app: INestApplication;

  const mockEmailVerificationService = {
    verifyEmail: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EmailVerificationService)
      .useValue(mockEmailVerificationService)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
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

  it('POST /email-verification/verify -> 200', async () => {
    mockEmailVerificationService.verifyEmail.mockResolvedValue({
      message: 'Email verified',
    });

    await request(app.getHttpServer())
      .post('/email-verification/verify')
      .send({ token: 'valid-token' })
      .expect(200)
      .expect({ message: 'Email verified' });
  });

  it('POST /email-verification/verify -> 400 for invalid token', async () => {
    mockEmailVerificationService.verifyEmail.mockRejectedValue(
      new BadRequestException('Invalid or expired token'),
    );

    await request(app.getHttpServer())
      .post('/email-verification/verify')
      .send({ token: 'invalid-token' })
      .expect(400);
  });

  it('POST /email-verification/verify -> 400 for missing token', async () => {
    await request(app.getHttpServer())
      .post('/email-verification/verify')
      .send({})
      .expect(400);
  });
});
