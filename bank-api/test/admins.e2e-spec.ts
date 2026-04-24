import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AdminService } from '../src/admin/admin.service';

describe('AccountsController (e2e)', () => {
  let app: INestApplication;

  const mockAdminService = {
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
      .overrideProvider(AdminService)
      .useValue(mockAdminService)
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
  // ✅ GET ALL ADMINS → 200
  // =========================
  it('GET /admin → 200', async () => {
    const mockData = [
      {
        admin_name: 'Sam',
        email: 'Sam@admin.com',
        password: '6789',
        phone: '123456789',
        customer_address: 'Manchester, 156 Manchester Road',
        dob: '1995-06-15',
      },
    ];

    mockAdminService.findAll.mockResolvedValue(mockData);

    await request(app.getHttpServer())
      .get('/admin')
      .expect(200)
      .expect(mockData);
  });
});
