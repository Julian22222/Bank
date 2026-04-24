import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { mockAdminService } from './admin.controller.mock';

describe('AdminController', () => {
  let controller: AdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [{ provide: AdminService, useValue: mockAdminService }],
    }).compile();

    controller = module.get<AdminController>(AdminController);
  });

  it('Test 1: should return all admin users', async () => {
    expect(await controller.findAll()).toEqual([
      {
        admin_id: 1,
        admin_name: 'Sam',
        email: 'Sam@admin.com',
        phone: '123456789',
        customer_address: 'Manchester, 156 Manchester Road',
        dob: '1995-06-15',
        created_at: '2026-04-20 20:53:22.314',
      },
    ]);
  });

  it('Test 2: should return one admin user', async () => {
    const admin_id = 1;

    expect(await controller.findOne(admin_id)).toEqual({
      admin_id: 1,
      admin_name: 'Sam',
      email: 'Sam@admin.com',
      phone: '123456789',
      customer_address: 'Manchester, 156 Manchester Road',
      dob: '1995-06-15',
      created_at: '2026-04-20 20:53:22.314',
    });
  });

  it('Test 3: findOne - handle error. Should return Admin not found', async () => {
    const accountId = 999;

    mockAdminService.findOne.mockRejectedValue(new Error('Admin not found'));

    await expect(controller.findOne(accountId)).rejects.toThrow(
      'Admin not found',
    );
  });

  it('Test 4: should CREATE a new admin and return this new admin', async () => {
    const newAdmin = {
      admin_name: 'Tom',
      email: 'tom.doe@example.com',
      password: 'mypassword',
      phone: '+4408951416587',
      customer_address: 'Leeds, UK',
      dob: '1995-01-01',
    };

    expect(await controller.createNewAccount(newAdmin)).toEqual({
      admin_id: 2,
      admin_name: 'Tom',
      email: 'tom.doe@example.com',
      phone: '123456789',
      customer_address: 'Leeds, UK',
      dob: '1995-01-01',
      created_at: '2026-04-20 20:53:22.314',
    });
  });

  it('Test 5:should UPDATE a Admin and return details of Updated Admin', async () => {
    const adminId = 1;
    const updateAdmin = { admin_name: 'Billy' };

    expect(await controller.updateAdminDetails(adminId, updateAdmin)).toEqual({
      admin_id: 1,
      admin_name: 'Billy',
      email: 'billy"test.com',
      phone: '123456789',
      customer_address: 'address test',
      dob: '1993-01-01',
      created_at: '2026-04-20 20:53:22.314',
    });
  });

  it('Test 6:should UPDATE a Admin`s password and return text - Password updated successfully', async () => {
    const adminId = 1;
    const updatePassword = {
      oldPassword: '12345667',
      newPassword: 'newPassword',
    };

    expect(
      await controller.updateAdminPassword(adminId, updatePassword),
    ).toEqual({
      message: 'Password updated successfully',
    });
  });

  it('Test 7: should REMOVE and return text - Account deleted successfully', async () => {
    const accountId = 2;

    expect(await controller.remove(accountId)).toEqual({
      message: 'Admin deleted successfully',
    });
  });

  it('Test 8: should REMOVE - error handling. should return - Transaction not found', async () => {
    const accountId = 999;

    mockAdminService.remove.mockRejectedValue(new Error('Admin not found'));

    await expect(controller.remove(accountId)).rejects.toThrow(
      'Admin not found',
    );
  });
});
