import { Test, TestingModule } from '@nestjs/testing';
import { AuthAdminController } from './auth-admin.controller';
import { AuthAdminService } from './auth-admin.service';
import { mockAuthAdminService } from './auth-admin.controller.mock';
import { Response } from 'express';

describe('AuthAdminController', () => {
  let controller: AuthAdminController;
  let authAdminService: AuthAdminService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [AuthAdminController],
      providers: [
        { provide: AuthAdminService, useValue: mockAuthAdminService },
      ],
    }).compile();

    jest.clearAllMocks();

    controller = module.get<AuthAdminController>(AuthAdminController);
    authAdminService = module.get<AuthAdminService>(AuthAdminService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await module.close();
  });

  describe('login', () => {
    it('should login and return the user', async () => {
      const loginData = {
        email: 'sam@admin.com',
        password: 'admin123',
        rememberMe: false,
      };

      const res = {
        cookie: jest.fn(),
        clearCookie: jest.fn(),
      } as unknown as Response;

      expect(await controller.login(loginData, res)).toEqual({
        admin_id: 1,
        role: 'Admin',
        admin_name: 'Sam',
        email: 'sam@admin.com',
        phone: '+447835473879',
        customer_address: 'Manchester, UK',
        dob: '1995-06-15',
        created_at: '2026-04-20 20:53:22',
      });
    });
  });

  describe('logout', () => {
    it('should call logout and clear cookies', async () => {
      const res = {
        clearCookie: jest.fn(),
      } as unknown as Response;

      const result = await controller.logout(res);

      expect(res.clearCookie).toHaveBeenCalledWith('access_token');
      expect(res.clearCookie).toHaveBeenCalledWith('refresh_token');
      expect(result).toEqual({ message: 'Logged out' });
    });
  });
});
