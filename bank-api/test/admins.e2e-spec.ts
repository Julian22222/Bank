import request from 'supertest';
import { Test } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common';

jest.mock('@nestjs/schedule', () => ({
  ScheduleModule: {
    forRoot: jest.fn(() => ({ module: class MockScheduleModule {} })),
  },
  Cron: jest.fn(),
}));

import { AppModule } from '../src/app.module';
import { AdminService } from '../src/admin/admin.service';
import { JwtAdminGuard } from '../src/auth-admin/jwt-auth.guard';
import { RolesGuard } from '../src/auth-admin/roles.guard';

describe('AdminController (e2e)', () => {
  let app: INestApplication;

  const mockAdminService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updatePassword: jest.fn(),
    remove: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AdminService)
      .useValue(mockAdminService)
      .overrideGuard(JwtAdminGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
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

  it('GET /admin -> 200', async () => {
    const mockData = [
      {
        admin_id: 1,
        role: 'superAdmin',
        admin_name: 'Sam',
        email: 'sam@admin.com',
        phone: '+447835473879',
        customer_address: 'Manchester, UK',
        dob: '1995-06-15',
        created_at: '2026-04-20 20:53:22.314',
      },
    ];

    mockAdminService.findAll.mockResolvedValue(mockData);

    await request(app.getHttpServer())
      .get('/admin')
      .expect(200)
      .expect(mockData);
  });

  it('GET /admin/1 -> 200', async () => {
    const mockAdmin = {
      admin_id: 1,
      role: 'superAdmin',
      admin_name: 'Sam',
      email: 'sam@admin.com',
      phone: '+447835473879',
      customer_address: 'Manchester, UK',
      dob: '1995-06-15',
      created_at: '2026-04-20 20:53:22.314',
    };

    mockAdminService.findOne.mockResolvedValue(mockAdmin);

    await request(app.getHttpServer())
      .get('/admin/1')
      .expect(200)
      .expect(mockAdmin);
  });

  it('GET /admin/999 -> 404', async () => {
    mockAdminService.findOne.mockRejectedValue(
      new NotFoundException('Admin not found'),
    );

    await request(app.getHttpServer()).get('/admin/999').expect(404);
  });

  it('POST /admin -> 201', async () => {
    const newAdmin = {
      admin_name: 'Tom',
      role: 'admin',
      email: 'tom.doe@example.com',
      password: 'mypassword',
      phone: '+447835473879',
      customer_address: 'Leeds, UK',
      dob: '1995-01-01',
    };

    mockAdminService.create.mockResolvedValue({
      admin_id: 2,
      ...newAdmin,
      created_at: '2026-04-20 20:53:22.314',
    });

    await request(app.getHttpServer())
      .post('/admin')
      .send(newAdmin)
      .expect(201)
      .expect({
        admin_id: 2,
        ...newAdmin,
        created_at: '2026-04-20 20:53:22.314',
      });
  });

  it('POST /admin -> 400 for invalid payload', async () => {
    await request(app.getHttpServer())
      .post('/admin')
      .send({
        admin_name: 'Bad',
        email: 'not-an-email',
      })
      .expect(400);
  });

  it('PATCH /admin/1 -> 200', async () => {
    const updatedAdmin = {
      admin_name: 'Billy',
      customer_address: 'Manchester, UK',
    };

    mockAdminService.update.mockResolvedValue({
      admin_id: 1,
      role: 'superAdmin',
      admin_name: 'Billy',
      email: 'admin@example.com',
      phone: '+447835473879',
      customer_address: 'Manchester, UK',
      dob: '1995-06-15',
      created_at: '2026-04-20 20:53:22.314',
    });

    await request(app.getHttpServer())
      .patch('/admin/1')
      .send(updatedAdmin)
      .expect(200)
      .expect({
        admin_id: 1,
        role: 'superAdmin',
        admin_name: 'Billy',
        email: 'admin@example.com',
        phone: '+447835473879',
        customer_address: 'Manchester, UK',
        dob: '1995-06-15',
        created_at: '2026-04-20 20:53:22.314',
      });
  });

  it('PATCH /admin/999 -> 404', async () => {
    mockAdminService.update.mockRejectedValue(
      new NotFoundException('Admin not found'),
    );

    await request(app.getHttpServer())
      .patch('/admin/999')
      .send({ admin_name: 'Nope' })
      .expect(404);
  });

  it('DELETE /admin/1 -> 200', async () => {
    mockAdminService.remove.mockResolvedValue({
      message: 'Admin deleted successfully',
    });

    await request(app.getHttpServer())
      .delete('/admin/1')
      .expect(200)
      .expect({ message: 'Admin deleted successfully' });
  });

  it('DELETE /admin/999 -> 404', async () => {
    mockAdminService.remove.mockRejectedValue(
      new NotFoundException('Admin not found'),
    );

    await request(app.getHttpServer()).delete('/admin/999').expect(404);
  });
});
