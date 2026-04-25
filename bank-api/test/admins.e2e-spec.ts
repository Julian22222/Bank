import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AdminService } from '../src/admin/admin.service';

describe('AdminController (e2e)', () => {
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
        admin_id: 2,
        admin_name: 'Tonny',
        email: 'Sam@admin.com',
        phone: '+447842727346',
        customer_address: 'Manchester, 156 Manchester Road',
        dob: '1995-06-15T00:00:00.000Z',
        created_at: '2026-04-25T14:31:44.471Z',
      },
      {
        admin_id: 2,
        admin_name: 'Sam',
        email: 'tony@test.com',
        phone: '+447842727346',
        customer_address: 'Manchester, 123 Liverpool Road',
        dob: '1997-06-15T00:00:00.000Z',
        created_at: '2026-04-25T14:35:44.471Z',
      },
    ];

    mockAdminService.findAll.mockResolvedValue(mockData);

    await request(app.getHttpServer())
      .get('/admin')
      .expect(200)
      .expect(mockData);
  });

  // =========================
  // ✅ GET ALL ADMIN ACCOUNTS → 200
  // =========================
  it('GET /admin/1 → 200', async () => {
    const mockUserAccounts = [
      {
        admin_id: 2,
        admin_name: 'Tonny',
        email: 'Sam@admin.com',
        phone: '+447842727346',
        customer_address: 'Manchester, 156 Manchester Road',
        dob: '1995-06-15T00:00:00.000Z',
        created_at: '2026-04-25T14:31:44.471Z',
      },
    ];

    mockAdminService.findOne.mockResolvedValue(mockUserAccounts);

    await request(app.getHttpServer())
      .get('/admin/1')
      .expect(200)
      .expect(mockUserAccounts);
  });

  //   // =========================
  //   // ❌ GET ALL ADMINS OF USER → 404
  //   // =========================
  it('GET /admin/999 → 404', async () => {
    mockAdminService.findOne.mockRejectedValue(
      new NotFoundException('Admin is not found'),
    );

    await request(app.getHttpServer()).get('/admin/999').expect(404);
  });

  //   // =========================
  //   // ✅ CREATE ADMIN → 201
  //   // =========================
  it('POST /admin → 201', async () => {
    const newAdmin = {
      admin_name: 'Anthony',
      email: 'Sam@admin.com',
      password: '123456',
      phone: '+447835473879',
      customer_address: 'Manchester, 156 Manchester Road',
      dob: '1995-06-15T00:00:00.000Z',
    };

    mockAdminService.create.mockResolvedValue({
      admin_id: 2,
      ...newAdmin,
      created_at: '2026-04-25 14:31:44.471',
    });

    await request(app.getHttpServer()).post('/admin').send(newAdmin);
  });

  //   // =========================
  //   // ❌ CREATE ADMIN → 400
  //   // =========================
  it('POST /admin → 400 (validation error)', async () => {
    await request(app.getHttpServer())
      .post('/admin')
      .send({
        phone: +447893737825, // invalid
      })
      .expect(400);
  });

  //   // =========================
  //   // ✅ PATCH /admin/:id → 200
  //   // =========================
  it('PATCH /admin/1 → 200', async () => {
    const updatedAdmin = {
      admin_name: 'Jack',
      email: 'jack@admin.com',
    };

    mockAdminService.update.mockResolvedValue({
      admin_id: 1,
      ...updatedAdmin,
      phone: '+447835473879',
      customer_address: 'Manchester, 156 Manchester Road',
      dob: '1995-06-15T00:00:00.000Z',
      created_at: '2026-04-25 14:31:44.471',
    });

    await request(app.getHttpServer())
      .patch('/admin/1')
      .send(updatedAdmin)
      .expect(200)
      .expect({
        admin_id: 1,
        ...updatedAdmin,
        phone: '+447835473879',
        customer_address: 'Manchester, 156 Manchester Road',
        dob: '1995-06-15T00:00:00.000Z',
        created_at: '2026-04-25 14:31:44.471',
      });
  });

  //   // =========================
  //   // ❌ PATCH /admin/:id → 404
  //   // =========================
  it('PATCH /admin/999 → 404', async () => {
    mockAdminService.update.mockRejectedValue(
      new NotFoundException('Admin not found'),
    );

    await request(app.getHttpServer()).patch('/admin/999').send({}).expect(404);
  });

  //   // =========================
  //   // ✅ DELETE /admin/:id → 200
  //   // =========================
  it('DELETE /users/1 → 200', async () => {
    mockAdminService.remove.mockResolvedValue('Admin deleted successfully');

    await request(app.getHttpServer())
      .delete('/admin/1')
      .expect(200)
      .expect('Admin deleted successfully');
  });

  //   // =========================
  //   // ❌ DELETE /admin/:id → 404
  //   // =========================
  it('DELETE /admin/999 → 404', async () => {
    mockAdminService.remove.mockRejectedValue(
      new NotFoundException('Admin not found'),
    );

    await request(app.getHttpServer()).delete('/admin/999').expect(404);
  });
});
