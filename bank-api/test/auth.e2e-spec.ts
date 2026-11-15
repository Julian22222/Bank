import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';

jest.mock('@nestjs/schedule', () => ({
  ScheduleModule: {
    forRoot: jest.fn(() => ({ module: class MockScheduleModule {} })),
  },
  Cron: jest.fn(),
}));

import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  const mockAuthService = {
    login: jest.fn(),
    refreshToken: jest.fn(),
    sendVerificationEmail: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
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

  it('GET /auth -> 200', async () => {
    await request(app.getHttpServer())
      .get('/auth')
      .expect(200)
      .expect({ message: 'Auth endpoint is working!' });
  });

  it('POST /auth/login -> 201', async () => {
    const loginData = {
      email: 'julian@test.com',
      password: 'password123',
    };

    const loginResult = {
      userResponse: {
        customer_id: 1,
        first_name: 'Julian',
        last_name: 'Golovens',
        email: 'julian@test.com',
        phone: '+447892828658',
        customer_address: '123 Main St, Springfield, IL',
        dob: '1995-06-15',
        created_at: '2026-04-20 20:53:22.314',
      },
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    };

    mockAuthService.login.mockResolvedValue(loginResult);

    await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginData)
      .expect(201)
      .expect(loginResult);
  });

  it('POST /auth/login -> 400 for invalid payload', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'not-an-email',
        password: '123',
      })
      .expect(400);
  });

  it('POST /auth/logout -> 201', async () => {
    await request(app.getHttpServer())
      .post('/auth/logout')
      .expect(201)
      .expect({ message: 'Logged out' });
  });
});
