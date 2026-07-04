import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { mockAccountsService } from './accounts.controller.mock';

describe('AccountsController', () => {
  let controller: AccountsController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [{ provide: AccountsService, useValue: mockAccountsService }],
    }).compile();

    controller = module.get<AccountsController>(AccountsController);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await module.close();
  });

  describe('findAll', () => {
    it('should return all accounts', async () => {
      expect(await controller.findAll()).toEqual([
        {
          accont_id: 1,
          customer_id: 1,
          account_type: 'Main',
          account_nr: '12-34-56 / 98765432',
        },
        {
          accont_id: 2,
          customer_id: 1,
          account_type: 'Saver',
          account_nr: '98-76-54 / 12345678',
        },
        {
          accont_id: 3,
          customer_id: 2,
          account_type: 'Main',
          account_nr: '11-22-33 / 11223344',
        },
      ]);
    });

    it('should return all user accounts table + customers data', async () => {
      expect(await controller.findAllWithCustomers()).toEqual([
        {
          account_id: 1,
          customer_id: 1,
          account_type: 'Main',
          account_nr: '12-34-56 / 98765432',
          created_at: '2026-04-13T18:40:52.189Z',
          first_name: 'Julian',
          last_name: 'Golovens',
          email: 'julian@test.com',
          phone: '123-456-7890',
          customer_address: '123 Main St, Springfield, IL',
          dob: '1995-06-15T00:00:00.000Z',
        },
        {
          account_id: 2,
          customer_id: 1,
          account_type: 'Saver',
          account_nr: '98-76-54 / 12345678',
          created_at: '2026-04-13T18:40:52.191Z',
          first_name: 'Julian',
          last_name: 'Golovens',
          email: 'julian@test.com',
          phone: '123-456-7890',
          customer_address: '123 Main St, Springfield, IL',
          dob: '1995-06-15T00:00:00.000Z',
        },
      ]);
    });

    it('should return all user accounts + balance', async () => {
      const customerId = 1;

      expect(await controller.searchUsersAccountAndBalance(customerId)).toEqual(
        {
          accont_id: 1,
          customer_id: 1,
          account_type: 'Main',
          account_nr: '12-34-56 / 98765432',
          balance: 2253.93,
        },
      );
    });
  });

  describe('findOne', () => {
    it('should return all user accounts', async () => {
      const customerId = 1;

      const result = await controller.findOne(customerId);

      expect(result).toEqual([
        {
          accont_id: 1,
          customer_id: 1,
          account_type: 'Main',
          account_nr: '12-34-56 / 98765432',
        },
        {
          customer_id: 1,
          account_type: 'Saver',
          account_nr: '98-76-54 / 12345678',
        },
      ]);
      expect(mockAccountsService.findOne).toHaveBeenCalledWith(customerId);
      expect(result[0].customer_id).toBe(customerId);
    });

    it('should handle error when account is not found', async () => {
      const customerId = 999;

      mockAccountsService.findOne.mockRejectedValue(
        new Error('Account not found'),
      );

      await expect(controller.findOne(customerId)).rejects.toThrow(
        'Account not found',
      );
    });
  });

  describe('create', () => {
    it('should create a new account and return this new account', async () => {
      const newAccount = {
        customer_id: 2,
        account_type: 'Saver',
        account_nr: '01-20-88 / 98765432',
      };

      const result = await controller.create(newAccount);

      expect(result).toEqual({
        account_id: 4,
        customer_id: 2,
        account_type: 'Saver',
        account_nr: '01-20-88 / 98765432',
      });

      expect(mockAccountsService.create).toHaveBeenCalledWith(newAccount);
      expect(mockAccountsService.create).toHaveBeenCalledTimes(1);
      expect(mockAccountsService.create).toHaveBeenCalledWith(
        expect.objectContaining(newAccount),
      );
      expect(result.account_id).toBeDefined();
      expect(result.customer_id).toBe(newAccount.customer_id);
    });
  });

  describe('update', () => {
    it('should update a user and return details of Updated User', async () => {
      const accountId = 3;

      const updatedAccount = {
        customer_id: 2,
        account_type: 'Main',
        account_nr: '11-22-33 / 11223344',
      };

      const result = await controller.update(accountId, updatedAccount);

      expect(result).toEqual({
        account_id: 3,
        customer_id: 2,
        account_type: 'Main',
        account_nr: '11-22-33 / 11223344',
      });

      expect(mockAccountsService.update).toHaveBeenCalledTimes(1);

      expect(mockAccountsService.update).toHaveBeenCalledWith(
        accountId,
        expect.objectContaining(updatedAccount),
      );

      expect(result.account_id).toBeDefined();
      expect(result.customer_id).toBe(updatedAccount.customer_id);
    });

    it('should handle error when account is not found', async () => {
      const accountId = 999;

      const updatedAccount = {
        customer_id: 2,
        account_type: 'Main',
        account_nr: '11-22-33 / 11223344',
      };

      mockAccountsService.update.mockRejectedValue(
        new Error('Account not found'),
      );

      await expect(
        controller.update(accountId, updatedAccount),
      ).rejects.toThrow('Account not found');
    });
  });

  describe('remove', () => {
    it('should remove a user and return text - Account deleted successfully', async () => {
      const accountId = 3;

      const result = await controller.remove(accountId);

      expect(result).toBe('Account deleted successfully');

      expect(mockAccountsService.remove).toHaveBeenCalledWith(accountId);
      expect(mockAccountsService.remove).toHaveBeenCalledTimes(1);
      expect(mockAccountsService.remove).toHaveBeenCalledWith(
        expect.any(Number),
      );
      expect(result).toBeDefined();
    });

    it('should handle error when account is not found', async () => {
      const accountId = 999;

      mockAccountsService.findOne.mockRejectedValue(
        new Error('Account not found'),
      );

      await expect(controller.findOne(accountId)).rejects.toThrow(
        'Account not found',
      );
    });
  });

  it('should handle error', async () => {
    const accountId = 999;
    mockAccountsService.remove.mockRejectedValue(
      new Error('Account not found'),
    );
    await expect(controller.remove(accountId)).rejects.toThrow(
      'Account not found',
    );
  });
});
