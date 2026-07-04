import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { mockTransactionsService } from './transactions.controller.mock';
import { CreateTransactionDto } from './dto/create-transaction.dto';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        { provide: TransactionsService, useValue: mockTransactionsService },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await module.close();
  });

  describe('findAll', () => {
    it('should return all transactions from service', async () => {
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
      ]);
    });

    it('should return transactions + customers data + accounts.account_type', async () => {
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
  });

  describe('findOne', () => {
    const transactionId = 1;

    it('should return one transaction', async () => {
      const result = await controller.findOne(transactionId);

      expect(result).toEqual({
        transaction_id: 1,
        account_id: 1,
        customer_id: 1,
        money_amount: +2000.0,
        balance: 3000.0,
        details: 'Initial deposit',
      });
    });

    it('should call findOne with the correct transactionId', async () => {
      const result = await controller.findOne(transactionId);

      expect(result.transaction_id).toBe(transactionId);
    });

    it('should have the correct account_id and customer_id for the transaction', async () => {
      const result = await controller.findOne(transactionId);

      expect(result.account_id).toBeDefined();
      expect(result.customer_id).toBeDefined();
    });

    it('should call findOne and have the correct transactionId', async () => {
      const result = await controller.findOne(transactionId);

      expect(mockTransactionsService.findOne).toHaveBeenCalledWith(
        transactionId,
      );
      expect(mockTransactionsService.findOne).toHaveBeenCalledTimes(1);
    });

    it('should handle error when transaction is not found', async () => {
      const accountId = 999;

      mockTransactionsService.findOne.mockRejectedValue(
        new Error('Transaction not found'),
      );

      await expect(controller.findOne(accountId)).rejects.toThrow(
        'Transaction not found',
      );
    });
  });

  describe('findAllCurrentUser', () => {
    const customerId = 2;

    it('should return all transactions for the current user', async () => {
      const result =
        await controller.findAllCurrentUSerTransactions(customerId);

      expect(result).toEqual([
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
      ]);
    });

    it('should call findCurrentUserAllTrx with the correct customerId', async () => {
      await controller.findAllCurrentUSerTransactions(customerId);

      expect(
        mockTransactionsService.findCurrentUserAllTrx,
      ).toHaveBeenCalledWith(customerId);
    });

    it('should have the correct number of transactions for the current user', async () => {
      await controller.findAllCurrentUSerTransactions(customerId);

      expect(
        mockTransactionsService.findCurrentUserAllTrx,
      ).toHaveBeenCalledTimes(1);
    });

    it('should return the correct number of transactions for the current user', async () => {
      const result =
        await controller.findAllCurrentUSerTransactions(customerId);

      expect(result).toHaveLength(3);
    });
  });

  describe('create', () => {
    it('should CREATE a new transaction and return this new transaction', async () => {
      const newStatement = {
        account_id: 1,
        customer_id: 1,
        money_amount: +100.0,
        balance: 100.0,
        details: 'test statement',
      };

      const result = await controller.create(newStatement);

      expect(result).toEqual({
        transaction_id: 26,
        account_id: 1,
        customer_id: 1,
        money_amount: +100.0,
        balance: 100.0,
        details: 'test statement',
      });

      expect(mockTransactionsService.create).toHaveBeenCalledWith(newStatement);
      expect(result.transaction_id).toBe(26);
    });

    //error handling
    it('error handling. should throw error on create transaction failure', async () => {
      mockTransactionsService.create.mockRejectedValue(
        new Error('Create failed'),
      );

      await expect(
        controller.create({} as CreateTransactionDto),
      ).rejects.toThrow('Create failed');
    });
  });

  describe('update', () => {
    it('should UPDATE a transaction and return details of Updated transaction', async () => {
      const transaction_id = 3;

      const updatedTransaction = {
        account_id: 1,
        customer_id: 1,
        money_amount: -4.5,
        balance: 2495.5,
        details: 'ASDA Shopping',
      };

      const result = await controller.update(
        transaction_id,
        updatedTransaction,
      );

      expect(result).toEqual({
        transaction_id,
        account_id: 1,
        customer_id: 1,
        money_amount: -4.5,
        balance: 2495.5,
        details: 'ASDA Shopping',
      });
    });

    it('error handling. updating transaction and return Transaction not found', async () => {
      const transaction_id = 999;

      const updatedTransaction = {
        account_id: 1,
        customer_id: 1,
        money_amount: -4.5,
        balance: 2495.5,
        details: 'ASDA Shopping',
      };

      mockTransactionsService.update.mockRejectedValue(
        new Error('Transaction not found'),
      );

      await expect(
        controller.update(transaction_id, updatedTransaction),
      ).rejects.toThrow('Transaction not found');
      expect(mockTransactionsService.update).toHaveBeenCalledWith(
        transaction_id,
        updatedTransaction,
      );
      expect(mockTransactionsService.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should REMOVE and return text - Account deleted successfully', async () => {
      const transactionId = 3;

      expect(await controller.remove(transactionId)).toBe(
        'Transaction deleted successfully',
      );

      expect(mockTransactionsService.remove).toHaveBeenCalledWith(
        transactionId,
      );
    });

    it('should throw if transaction is not found', async () => {
      const transactionId = 999;

      mockTransactionsService.remove.mockRejectedValue(
        new Error('Transaction not found'),
      );

      await expect(controller.remove(transactionId)).rejects.toThrow(
        'Transaction not found',
      );
    });
  });
});
