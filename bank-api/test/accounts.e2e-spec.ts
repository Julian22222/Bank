import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AccountsService } from '../src/accounts/accounts.service';

describe('AccountsController (e2e)', () => {
  let app: INestApplication;

  const mockAccountsService = {
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
      .overrideProvider(AccountsService)
      .useValue(mockAccountsService)
      .compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // removes unknown fields
        forbidNonWhitelisted: true, // throws error for extra fields
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
  // ✅ GET ALL ACCOUNTS → 200
  // =========================
  it('GET /accounts → 200', async () => {
    const mockData = [
      {
        accont_id: 1,
        customer_id: 1,
        account_type: 'Main',
        account_nr: '12-34-56 / 98765432',
        balance: 2253.93,
      },
      {
        accont_id: 2,
        customer_id: 1,
        account_type: 'Saver',
        account_nr: '98-76-54 / 12345678',
        balance: 1500.0,
      },
      {
        accont_id: 3,
        customer_id: 2,
        account_type: 'Main',
        account_nr: '11-22-33 / 11223344',
        balance: 1400.0,
      },
    ];

    mockAccountsService.findAll.mockResolvedValue(mockData);

    await request(app.getHttpServer())
      .get('/accounts')
      .expect(200)
      .expect(mockData);
  });

  // =========================
  // ✅ GET ALL USER ACCOUNTS → 200
  // =========================
  it('GET /accounts/1 → 200', async () => {
    const mockUserAccounts = [
      {
        accont_id: 1,
        customer_id: 1,
        account_type: 'Main',
        account_nr: '12-34-56 / 98765432',
        balance: 2253.93,
      },
      {
        customer_id: 1,
        account_type: 'Saver',
        account_nr: '98-76-54 / 12345678',
        balance: 1500.0,
      },
    ];

    mockAccountsService.findOne.mockResolvedValue(mockUserAccounts);

    await request(app.getHttpServer())
      .get('/accounts/1')
      .expect(200)
      .expect(mockUserAccounts);
  });

  //   // =========================
  //   // ❌ GET ALL ACCOUNTS OF USER → 404
  //   // =========================
  it('GET /accounts/999 → 404', async () => {
    mockAccountsService.findOne.mockRejectedValue(
      new NotFoundException('Accounts of this user not found'),
    );

    await request(app.getHttpServer()).get('/accounts/999').expect(404);
  });

  //   // =========================
  //   // ✅ CREATE ACCOUNT → 201
  //   // =========================
  it('POST /accounts → 201', async () => {
    const newAccount = {
      customer_id: 2,
      account_type: 'Saver',
      account_nr: '01-20-88 / 98765432',
    };

    mockAccountsService.create.mockResolvedValue({
      account_id: 3,
      ...newAccount,
    });

    await request(app.getHttpServer())
      .post('/accounts')
      .send(newAccount)
      .expect(201)
      .expect({
        account_id: 3,
        ...newAccount,
      });
  });

  //   // =========================
  //   // ❌ CREATE ACCOUNT → 400
  //   // =========================
  it('POST /accounts → 400 (validation error)', async () => {
    await request(app.getHttpServer())
      .post('/accounts')
      .send({
        first_name: '', // invalid
        email: 'not-an-email', // invalid
      })
      .expect(400);
  });

  //   // =========================
  //   // ✅ PATCH /accounts/:id → 200
  //   // =========================
  it('PATCH /accounts/3 → 200', async () => {
    const updatedAccount = {
      customer_id: 2,
      account_type: 'Main',
      account_nr: '11-22-33 / 11223344',
    };

    mockAccountsService.update.mockResolvedValue({
      account_id: 3,
      ...updatedAccount,
    });

    await request(app.getHttpServer())
      .patch('/accounts/1')
      .send(updatedAccount)
      .expect(200)
      .expect({
        account_id: 3,
        ...updatedAccount,
      });
  });

  //   // =========================
  //   // ❌ PATCH /accounts/:id → 404
  //   // =========================
  it('PATCH /accounts/999 → 404', async () => {
    mockAccountsService.update.mockRejectedValue(
      new NotFoundException('Account not found'),
    );

    await request(app.getHttpServer())
      .patch('/accounts/999')
      .send({})
      .expect(404);
  });

  //   // =========================
  //   // ✅ DELETE /accounts/:id → 200
  //   // =========================
  it('DELETE /accounts/1 → 200', async () => {
    mockAccountsService.remove.mockResolvedValue(
      'Account removed successfully',
    );

    await request(app.getHttpServer())
      .delete('/accounts/1')
      .expect(200)
      .expect('Account removed successfully');
  });

  //   // =========================
  //   // ❌ DELETE /users/:id → 404
  //   // =========================
  it('DELETE /accounts/999 → 404', async () => {
    mockAccountsService.remove.mockRejectedValue(
      new NotFoundException('Account not found'),
    );

    await request(app.getHttpServer()).delete('/accounts/999').expect(404);
  });
});
