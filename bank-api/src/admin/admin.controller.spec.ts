import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { mockAdminService } from './admin.controller.mock';

describe('AdminController', () => {
  let controller: AdminController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [{ provide: AdminService, useValue: mockAdminService }],
    }).compile();

    controller = module.get<AdminController>(AdminController);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await module.close();
  });

  describe('findAll', () => {
    it('should return all admin users', async () => {
      const result = await controller.findAll();

      expect(result).toEqual([
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
  });

  describe('findOne', () => {
    const adminId = 1;

    it('should return one admin user', async () => {
      const result = await controller.findOne(adminId);

      expect(result).toEqual({
        admin_id: 1,
        admin_name: 'Sam',
        email: 'Sam@admin.com',
        phone: '123456789',
        customer_address: 'Manchester, 156 Manchester Road',
        dob: '1995-06-15',
        created_at: '2026-04-20 20:53:22.314',
      });
    });
    it('should call findOne with the correct admin_id', async () => {
      await controller.findOne(adminId);
      expect(mockAdminService.findOne).toHaveBeenCalledWith(1);
    });

    it('should return the correct admin_id', async () => {
      const result = await controller.findOne(adminId);

      expect(result.admin_id).toBe(adminId);
    });

    it('should handle error when admin is not found', async () => {
      const accountId = 999;

      mockAdminService.findOne.mockRejectedValue(new Error('Admin not found'));

      await expect(controller.findOne(accountId)).rejects.toThrow(
        'Admin not found',
      );
    });
  });

  describe('create', () => {
    const newAdmin = {
      admin_name: 'Tom',
      email: 'tom.doe@example.com',
      password: 'mypassword',
      phone: '+4408951416587',
      customer_address: 'Leeds, UK',
      dob: '1995-01-01',
    };

    it('create new admin user', async () => {
      const result = await controller.createNewAccount(newAdmin);

      expect(result).toEqual({
        admin_id: 2,
        admin_name: 'Tom',
        email: 'tom.doe@example.com',
        phone: '123456789',
        customer_address: 'Leeds, UK',
        dob: '1995-01-01',
        created_at: '2026-04-20 20:53:22.314',
      });

      expect(mockAdminService.create).toHaveBeenCalledWith(newAdmin);
      expect(mockAdminService.create).toHaveBeenCalledTimes(1);
      expect(result.admin_name).toBe('Tom');
      expect(result.email).toBe('tom.doe@example.com');
    });

    it('should throw if admin creation fails', async () => {
      mockAdminService.create.mockRejectedValue(
        new Error('Email already exists'),
      );
      await expect(controller.createNewAccount(newAdmin)).rejects.toThrow(
        'Email already exists',
      );
    });
  });

  describe('update', () => {
    const adminId = 1;

    it('should UPDATE a Admin and return details of Updated Admin', async () => {
      const updateAdmin = { admin_name: 'Billy' };

      const result = await controller.updateAdminDetails(adminId, updateAdmin);

      expect(result).toEqual({
        admin_id: 1,
        admin_name: 'Billy',
        email: 'billy@test.com',
        phone: '123456789',
        customer_address: 'address test',
        dob: '1993-01-01',
        created_at: '2026-04-20 20:53:22.314',
      });

      expect(mockAdminService.update).toHaveBeenCalledWith(
        adminId,
        updateAdmin,
      );
      expect(result.admin_name).toBe('Billy');
    });

    it('should UPDATE a Admin`s password and return text - Password updated successfully', async () => {
      const updatePassword = {
        oldPassword: '12345667',
        newPassword: 'newPassword',
      };

      expect(
        await controller.updateAdminPassword(adminId, updatePassword),
      ).toEqual({
        message: 'Password updated successfully',
      });

      expect(mockAdminService.updatePassword).toHaveBeenCalledWith(
        adminId,
        updatePassword,
      );
    });

    it('should throw if update fails', async () => {
      mockAdminService.update.mockRejectedValue(new Error('Update failed'));
      await expect(controller.updateAdminDetails(1, {} as any)).rejects.toThrow(
        'Update failed',
      );
    });

    it('should throw if update password fails', async () => {
      mockAdminService.updatePassword.mockRejectedValue(
        new Error('Password update failed'),
      );
      await expect(
        controller.updateAdminPassword(1, {} as any),
      ).rejects.toThrow('Password update failed');
    });
  });

  describe('remove', () => {
    it('should REMOVE and return text - Account deleted successfully', async () => {
      const accountId = 2;

      const result = await controller.remove(accountId);

      expect(result).toEqual({
        message: 'Admin deleted successfully',
      });
      expect(mockAdminService.remove).toHaveBeenCalledWith(accountId);
      expect(mockAdminService.remove).toHaveBeenCalledTimes(1);
      expect(result.message).toBe('Admin deleted successfully');
    });

    it('error handling. should return - Transaction not found', async () => {
      const accountId = 999;

      mockAdminService.remove.mockRejectedValue(new Error('Admin not found'));

      await expect(controller.remove(accountId)).rejects.toThrow(
        'Admin not found',
      );
    });
  });
});
