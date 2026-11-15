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
import { AuthAdminService } from '../src/auth-admin/auth-admin.service';

describe('AuthAdminController (e2e)', () => {
  let app: INestApplication;

  const mockAuthAdminService = {
    login: jest.fn(),
    refreshToken: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AuthAdminService)
      .useValue(mockAuthAdminService)
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

  it('GET /auth-admin -> 200', async () => {
    await request(app.getHttpServer())
      .get('/auth-admin')
      .expect(200)
      .expect({ message: 'Auth Admin endpoint is working!' });
  });

  it('POST /auth-admin/login -> 201', async () => {
    const loginData = {
      email: 'sam@admin.com',
      password: 'admin123',
      rememberMe: false,
    };

    const loginResult = {
      admin_id: 1,
      role: 'Admin',
      admin_name: 'Sam',
      email: 'sam@admin.com',
      phone: '+447835473879',
      customer_address: 'Manchester, UK',
      dob: '1995-06-15',
      created_at: '2026-04-20 20:53:22',
    };

    mockAuthAdminService.login.mockResolvedValue(loginResult);

    await request(app.getHttpServer())
      .post('/auth-admin/login')
      .send(loginData)
      .expect(201)
      .expect(loginResult);
  });

  it('POST /auth-admin/login -> 400 for invalid payload', async () => {
    await request(app.getHttpServer())
      .post('/auth-admin/login')
      .send({
        email: 'not-an-email',
        password: '123',
        rememberMe: 'yes',
      })
      .expect(400);
  });

  it('POST /auth-admin/logout -> 201', async () => {
    await request(app.getHttpServer())
      .post('/auth-admin/logout')
      .expect(201)
      .expect({ message: 'Logged out' });
  });

  it('POST /auth-admin/refresh -> 201', async () => {
    const refreshResult = {
      admin_id: 1,
      role: 'Admin',
      admin_name: 'Sam',
      email: 'sam@admin.com',
      phone: '+447835473879',
      customer_address: 'Manchester, UK',
      dob: '1995-06-15',
      created_at: '2026-04-20 20:53:22',
    };

    mockAuthAdminService.refreshToken.mockResolvedValue(refreshResult);

    await request(app.getHttpServer())
      .post('/auth-admin/refresh')
      .set('Cookie', ['access_token=abc'])
      .expect(201)
      .expect(refreshResult);
  });
});
