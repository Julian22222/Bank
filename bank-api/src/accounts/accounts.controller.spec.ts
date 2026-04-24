import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { mockAccountsService } from './accounts.controller.mock';

describe('AccountsController', () => {
  let controller: AccountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [{ provide: AccountsService, useValue: mockAccountsService }],
    }).compile();

    controller = module.get<AccountsController>(AccountsController);
  });

  it('Test 1: should return all accounts', async () => {
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

  it('Test 2: allAccounts, should return all user accounts table + customers data', async () => {
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

  it('Test 3: should return all user accounts + balance', async () => {
    const customerId = 1;

    expect(await controller.searchUsersAccountAndBalance(customerId)).toEqual({
      accont_id: 1,
      customer_id: 1,
      account_type: 'Main',
      account_nr: '12-34-56 / 98765432',
      balance: 2253.93,
    });
  });

  it('Test 4: findOne - should return all user accounts', async () => {
    const customerId = 1;

    expect(await controller.findOne(customerId)).toEqual([
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
  });

  it('Test 4: findOne - error handling. should return Account not found', async () => {
    const customerId = 999;

    mockAccountsService.findOne.mockRejectedValue(
      new Error('Account not found'),
    );

    await expect(controller.findOne(customerId)).rejects.toThrow(
      'Account not found',
    );
  });

  it('Test 5: CREATE - should create a new account and return this new account', async () => {
    const newAccount = {
      customer_id: 2,
      account_type: 'Saver',
      account_nr: '01-20-88 / 98765432',
    };

    expect(await controller.create(newAccount)).toEqual({
      account_id: 4,
      customer_id: 2,
      account_type: 'Saver',
      account_nr: '01-20-88 / 98765432',
    });
  });

  it('Test 6: UPDATE - should update a user and return details of Updated User', async () => {
    const accountId = 12;

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
  });

  it('Test 7: UPDATE error hadling - should update a user and return Account not found', async () => {
    const accountId = 999;

    const updatedAccount = {
      customer_id: 2,
      account_type: 'Main',
      account_nr: '11-22-33 / 11223344',
    };

    mockAccountsService.update.mockRejectedValue(
      new Error('Account not found'),
    );

    await expect(controller.update(accountId, updatedAccount)).rejects.toThrow(
      'Account not found',
    );
  });

  it('Test 8: REMOVE - should return Account deleted successfully', async () => {
    const accountId = 3;

    expect(await controller.remove(accountId)).toBe(
      'Account deleted successfully',
    );
  });

  it('Test 9: REMOVE error hadling- should return Account not found', async () => {
    const accountId = 999;

    mockAccountsService.findOne.mockRejectedValue(
      new Error('Account not found'),
    );

    await expect(controller.findOne(accountId)).rejects.toThrow(
      'Account not found',
    );
  });
});
