import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { TransactionsService } from '../src/transactions/transactions.service';

describe('TransactionsController (e2e)', () => {
  let app: INestApplication;

  const mockTransactionsService = {
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
      .overrideProvider(TransactionsService)
      .useValue(mockTransactionsService)
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
  // ✅ GET ALL TRANSACTIONS → 200
  // =========================
  it('GET /transactions → 200', async () => {
    const mockData = [
      {
        transaction_id: 1,
        account_id: 1,
        customer_id: 1,
        money_amount: +2000.0,
        balance: 3000.0,
        details: 'Initial deposit',
      },
      {
        transaction_id: 2,
        account_id: 1,
        customer_id: 1,
        money_amount: -500.0,
        balance: 2500.0,
        details: 'ATM Withdrawal',
      },
      {
        transaction_id: 3,
        account_id: 1,
        customer_id: 1,
        money_amount: -4.5,
        balance: 2495.5,
        details: 'Tesco Superstore',
      },
      {
        transaction_id: 4,
        account_id: 1,
        customer_id: 1,
        money_amount: -52.3,
        balance: 2443.2,
        details: 'Tesco Superstore',
      },
      {
        transaction_id: 5,
        account_id: 1,
        customer_id: 1,
        money_amount: +2400.0,
        balance: 4843.2,
        details: 'Salary - GOOGLE Ltd',
      },
      {
        transaction_id: 6,
        account_id: 1,
        customer_id: 1,
        money_amount: -10.99,
        balance: 4832.21,
        details: 'Netflix Subscription',
      },
      {
        transaction_id: 7,
        account_id: 1,
        customer_id: 1,
        money_amount: -49.2,
        balance: 4783.01,
        details: 'ASDA Groceries',
      },
      {
        transaction_id: 8,
        account_id: 1,
        customer_id: 1,
        money_amount: -340.45,
        balance: 4442.56,
        details: 'WaterUtilities Bill Payment',
      },
      {
        transaction_id: 9,
        account_id: 1,
        customer_id: 1,
        money_amount: -750.0,
        balance: 3692.56,
        details: 'Rent Payment',
      },
      {
        transaction_id: 10,
        account_id: 1,
        customer_id: 1,
        money_amount: -250.0,
        balance: 3442.56,
        details: 'Ryanair tickets',
      },
      {
        transaction_id: 11,
        account_id: 1,
        customer_id: 1,
        money_amount: -78.3,
        balance: 3364.26,
        details: 'Travel insurance',
      },
      {
        transaction_id: 12,
        account_id: 1,
        customer_id: 1,
        money_amount: -315.34,
        balance: 3048.92,
        details: 'British Gas payment',
      },
      {
        transaction_id: 13,
        account_id: 1,
        customer_id: 1,
        money_amount: -65.0,
        balance: 2983.92,
        details: 'Car Repair Service',
      },
      {
        transaction_id: 14,
        account_id: 1,
        customer_id: 1,
        money_amount: -120.0,
        balance: 2863.92,
        details: 'Grocery Shopping at Sainsburys',
      },
      {
        transaction_id: 15,
        account_id: 1,
        customer_id: 1,
        money_amount: -45.0,
        balance: 2818.92,
        details: 'Dining at Pizza Hut',
      },
      {
        transaction_id: 16,
        account_id: 1,
        customer_id: 1,
        money_amount: -30.0,
        balance: 2788.92,
        details: 'Uber Ride',
      },
      {
        transaction_id: 17,
        account_id: 1,
        customer_id: 1,
        money_amount: -15.0,
        balance: 2773.92,
        details: 'Book Purchase from Waterstones',
      },
      {
        transaction_id: 18,
        account_id: 1,
        customer_id: 1,
        money_amount: -209.75,
        balance: 2564.17,
        details: 'Dining at Olive Garden',
      },
      {
        transaction_id: 19,
        account_id: 1,
        customer_id: 1,
        money_amount: -150.0,
        balance: 2414.17,
        details: 'Amazon Purchase',
      },
      {
        transaction_id: 20,
        account_id: 1,
        customer_id: 1,
        money_amount: -40.0,
        balance: 2374.17,
        details: 'Gym Membership Fee',
      },
      {
        transaction_id: 21,
        account_id: 1,
        customer_id: 1,
        money_amount: -35.0,
        balance: 2339.17,
        details: 'Movie Tickets',
      },
      {
        transaction_id: 22,
        account_id: 1,
        customer_id: 1,
        money_amount: -78.24,
        balance: 2260.93,
        details: 'Gas Station Fuel',
      },
      {
        transaction_id: 23,
        account_id: 1,
        customer_id: 1,
        money_amount: -7.0,
        balance: 2253.93,
        details: 'Coffee Shop Visit',
      },
      {
        transaction_id: 24,
        account_id: 2,
        customer_id: 1,
        money_amount: +1500.0,
        balance: 1500.0,
        details: 'Initial deposit',
      },
      {
        transaction_id: 25,
        account_id: 3,
        customer_id: 2,
        money_amount: +1400.0,
        balance: 1400.0,
        details: 'Initial deposit',
      },
    ];

    mockTransactionsService.findAll.mockResolvedValue(mockData);

    await request(app.getHttpServer())
      .get('/transactions')
      .expect(200)
      .expect(mockData);
  });

  // =========================
  // ✅ GET ONE TRANSACTION → 200
  // =========================
  it('GET /transactions/1 → 200', async () => {
    const mockUser = {
      transaction_id: 1,
      account_id: 1,
      customer_id: 1,
      money_amount: +2000.0,
      balance: 3000.0,
      details: 'Initial deposit',
    };

    mockTransactionsService.findOne.mockResolvedValue(mockUser);

    await request(app.getHttpServer())
      .get('/transactions/1')
      .expect(200)
      .expect(mockUser);
  });

  //   // =========================
  //   // ❌ GET ONE TRANSACTION → 404
  //   // =========================
  it('GET /transactions/999 → 404', async () => {
    mockTransactionsService.findOne.mockRejectedValue(
      new NotFoundException('Transaction not found'),
    );

    await request(app.getHttpServer()).get('/transactions/999').expect(404);
  });

  //   // =========================
  //   // ✅ CREATE TRANSACTION → 201
  //   // =========================
  it('POST /transactions → 201', async () => {
    const newTrx = {
      account_id: 1,
      customer_id: 1,
      money_amount: +100.0,
      balance: 100.0,
      details: 'test statement',
    };

    mockTransactionsService.create.mockResolvedValue({
      transaction_id: 26,
      ...newTrx,
    });

    await request(app.getHttpServer())
      .post('/transactions')
      .send(newTrx)
      .expect(201)
      .expect({
        transaction_id: 26,
        ...newTrx,
      });
  });

  //   // =========================
  //   // ❌ CREATE TRANSACTION → 400
  //   // =========================
  it('POST /transactions → 400 (validation error)', async () => {
    await request(app.getHttpServer())
      .post('/transactions')
      .send({
        account_id: 1,
        customer_id: '1', // invalid
        money_amount: +100.0,
        balance: 100.0,
        details: '', // invalid
      })
      .expect(400);
  });

  //   // =========================
  //   // ✅ PATCH /transactions/:id → 200
  //   // =========================
  it('PATCH /transactions/1 → 200', async () => {
    const transaction_id = 1;

    const updatedTransaction = {
      account_id: 1,
      customer_id: 1,
      money_amount: -4.5,
      balance: 2495.5,
      details: 'ASDA Shopping',
    };

    mockTransactionsService.update.mockResolvedValue({
      transaction_id,
      ...updatedTransaction,
    });

    await request(app.getHttpServer())
      .patch('/transactions/1')
      .send(updatedTransaction)
      .expect(200)
      .expect({
        transaction_id,
        ...updatedTransaction,
      });
  });

  //   // =========================
  //   // ❌ PATCH /users/:id → 404
  //   // =========================
  it('PATCH /transactions/999 → 404', async () => {
    mockTransactionsService.update.mockRejectedValue(
      new NotFoundException('Transaction not found'),
    );

    await request(app.getHttpServer())
      .patch('/transactions/999')
      .send({})
      .expect(404);
  });

  //   // =========================
  //   // ✅ DELETE /transactions/:id → 200
  //   // =========================
  it('DELETE /transactions/1 → 200', async () => {
    mockTransactionsService.remove.mockResolvedValue(
      'Transaction removed successfully',
    );

    await request(app.getHttpServer())
      .delete('/transactions/1')
      .expect(200)
      .expect('Transaction removed successfully');
  });

  //   // =========================
  //   // ❌ DELETE /transactions/:id → 404
  //   // =========================
  it('DELETE /transactions/999 → 404', async () => {
    mockTransactionsService.remove.mockRejectedValue(
      new NotFoundException('Transaction not found'),
    );

    await request(app.getHttpServer()).delete('/transactions/999').expect(404);
  });
});
