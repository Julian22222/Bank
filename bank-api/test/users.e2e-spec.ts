import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  const mockUsersService = {
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
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    app = moduleRef.createNestApplication();

    // enable validation (IMPORTANT for 400 tests)
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
  // ✅ GET ALL USERS → 200
  // =========================
  it('GET /users → 200', async () => {
    const mockData = [
      {
        customer_id: 1,
        first_name: 'Julian',
        last_name: 'Golovens',
        email: 'julian@test.com',
        password: '123',
        phone: '123-456-7890',
        customer_address: '123 Main St, Springfield, IL',
        dob: '1995-06-15',
        created_at: '2026-04-20 20:53:22.314',
      },
      {
        customer_id: 2,
        first_name: 'Tom',
        last_name: 'Simpsons',
        email: 'tomSimpson@gmail.com',
        password: '01234',
        phone: '123-456-7890',
        customer_address: '456 Main St, Springfield, IL',
        dob: '1985-06-15',
        created_at: '2026-04-20 20:53:22.314',
      },
    ];

    mockUsersService.findAll.mockResolvedValue(mockData);

    await request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect(mockData);
  });

  // =========================
  // ✅ GET ONE USER → 200
  // =========================
  it('GET /users/1 → 200', async () => {
    const mockUser = {
      customer_id: 1,
      first_name: 'Julian',
      last_name: 'Golovens',
      email: 'julian@test.com',
      password: '123',
      phone: '+447892828658',
      customer_address: '123 Main St, Springfield, IL',
      dob: '1995-06-15',
      created_at: '2026-04-20 20:53:22.314',
    };

    mockUsersService.findOne.mockResolvedValue(mockUser);

    await request(app.getHttpServer())
      .get('/users/1')
      .expect(200)
      .expect(mockUser);
  });

  //   // =========================
  //   // ❌ GET ONE USER → 404
  //   // =========================
  it('GET /users/999 → 404', async () => {
    mockUsersService.findOne.mockRejectedValue(
      new NotFoundException('User not found'),
    );

    await request(app.getHttpServer()).get('/users/999').expect(404);
  });

  //   // =========================
  //   // ✅ CREATE USER → 201
  //   // =========================
  it('POST /users → 201', async () => {
    const newUser = {
      first_name: 'Bill',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      password: 'mypassword',
      phone: '+447892828658',
      customer_address: 'Manchester, UK',
      dob: '1990-01-01',
    };

    mockUsersService.create.mockResolvedValue({
      customer_id: 3,
      ...newUser,
      created_at: '2026-04-20 20:53:22.314',
    });

    await request(app.getHttpServer())
      .post('/users')
      .send(newUser)
      .expect(201)
      .expect({
        customer_id: 3,
        ...newUser,
        created_at: '2026-04-20 20:53:22.314',
      });
  });

  //   // =========================
  //   // ❌ CREATE USER → 400
  //   // =========================
  it('POST /users → 400 (validation error)', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({
        account_id: 4,
        customer_id: 2,
        account_type: 22, // invalid
        account_nr: '', // invalid
        balance: '200.00',
      })
      .expect(400);
  });

  //   // =========================
  //   // ✅ PATCH /users/:id → 200
  //   // =========================
  it('PATCH /users/1 → 200', async () => {
    const updatedUser = {
      first_name: 'Bill',
      last_name: 'McDoe',
      email: 'john.doe@example.com',
      phone: '+447892828658',
      customer_address: 'Manchester, UK',
      dob: '1990-01-01',
    };

    mockUsersService.update.mockResolvedValue({
      customer_id: 1,
      ...updatedUser,
      created_at: '2026-04-20 20:53:22.314',
    });

    await request(app.getHttpServer())
      .patch('/users/1')
      .send(updatedUser)
      .expect(200)
      .expect({
        customer_id: 1,
        ...updatedUser,
        created_at: '2026-04-20 20:53:22.314',
      });
  });

  //   // =========================
  //   // ❌ PATCH /users/:id → 404
  //   // =========================
  it('PATCH /users/999 → 404', async () => {
    mockUsersService.update.mockRejectedValue(
      new NotFoundException('User not found'),
    );

    await request(app.getHttpServer()).patch('/users/999').send({}).expect(404);
  });

  //   // =========================
  //   // ✅ DELETE /users/:id → 200
  //   // =========================
  it('DELETE /users/1 → 200', async () => {
    mockUsersService.remove.mockResolvedValue('User deleted successfully');

    await request(app.getHttpServer())
      .delete('/users/1')
      .expect(200)
      .expect('User deleted successfully');
  });

  //   // =========================
  //   // ❌ DELETE /users/:id → 404
  //   // =========================
  it('DELETE /users/999 → 404', async () => {
    mockUsersService.remove.mockRejectedValue(
      new NotFoundException('User not found'),
    );

    await request(app.getHttpServer()).delete('/users/999').expect(404);
  });
});
