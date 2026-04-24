import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { mockTransactionsService } from './transactions.controller.mock';

describe('TransactionsController', () => {
  let controller: TransactionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        { provide: TransactionsService, useValue: mockTransactionsService },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
  });

  it('Test1: should return all transactions', async () => {
    expect(await controller.findAll()).toEqual([
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
    ]);
  });

  it('Test 2: Should return transactions + customers data + accounts.account_type', async () => {
    expect(await controller.findAllWithDetails()).toEqual([
      {
        transaction_id: 1,
        account_id: 1,
        customer_id: 1,
        money_amount: +2000.0,
        balance: 3000.0,
        details: 'Initial deposit',
        transaction_date: '2026-04-13T18:40:52.194Z',
        first_name: 'Julian',
        last_name: 'Golovens',
        email: 'julian@test.com',
        phone: '123-456-7890',
        customer_address: '123 Main St, Springfield, IL',
        dob: '1995-06-15T00:00:00.000Z',
        account_type: 'Main',
      },
      {
        transaction_id: 2,
        account_id: 1,
        customer_id: 1,
        money_amount: -500.0,
        balance: 2500.0,
        details: 'ATM Withdrawal',
        transaction_date: '2026-04-13T18:40:52.196Z',
        first_name: 'Julian',
        last_name: 'Golovens',
        email: 'julian@test.com',
        phone: '123-456-7890',
        customer_address: '123 Main St, Springfield, IL',
        dob: '1995-06-15T00:00:00.000Z',
        account_type: 'Main',
      },
    ]);
  });

  it('Test 3: Should return one transaction', async () => {
    const transactionId = 1;

    expect(await controller.findOne(transactionId)).toEqual({
      transaction_id: 1,
      account_id: 1,
      customer_id: 1,
      money_amount: +2000.0,
      balance: 3000.0,
      details: 'Initial deposit',
    });
  });

  it('Test 4: findOne - handle error. Should return Transaction not found', async () => {
    const accountId = 999;

    mockTransactionsService.findOne.mockRejectedValue(
      new Error('Transaction not found'),
    );

    await expect(controller.findOne(accountId)).rejects.toThrow(
      'Transaction not found',
    );
  });

  it('Test 5: should return all transactions for the current user', async () => {
    const customerId = 2;

    expect(await controller.findAllCurrentUSerTransactions(customerId)).toEqual(
      [
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
      ],
    );
  });

  it('Test 5: should CREATE a new transaction and return this new transaction', async () => {
    const newStatement = {
      account_id: 1,
      customer_id: 1,
      money_amount: +100.0,
      balance: 100.0,
      details: 'test statement',
    };

    expect(await controller.create(newStatement)).toEqual({
      transaction_id: 26,
      account_id: 1,
      customer_id: 1,
      money_amount: +100.0,
      balance: 100.0,
      details: 'test statement',
    });
  });

  it('Test 6:should UPDATE a transaction and return details of Updated transaction', async () => {
    const transaction_id = 3;

    const updatedTransaction = {
      account_id: 1,
      customer_id: 1,
      money_amount: -4.5,
      balance: 2495.5,
      details: 'ASDA Shopping',
    };

    const result = await controller.update(transaction_id, updatedTransaction);

    expect(result).toEqual({
      transaction_id,
      account_id: 1,
      customer_id: 1,
      money_amount: -4.5,
      balance: 2495.5,
      details: 'ASDA Shopping',
    });
  });

  it('Test 7: should REMOVE and return text - Account deleted successfully', async () => {
    const accountId = 3;

    expect(await controller.remove(accountId)).toBe(
      'Transaction deleted successfully',
    );
  });

  it('Test 8: should REMOVE - error handling. should return - Transaction not found', async () => {
    const accountId = 999;

    mockTransactionsService.remove.mockRejectedValue(
      new Error('Transaction not found'),
    );

    await expect(controller.remove(accountId)).rejects.toThrow(
      'Transaction not found',
    );
  });
});
