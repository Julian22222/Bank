import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { AuthAdminController } from './auth-admin.controller';
import { AuthAdminService } from './auth-admin.service';
import { mockAuthAdminService } from './auth-admin.controller.mock';
import { JwtAuthRole } from './jwt-auth-role.guard';
import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { VerificationRepo } from '../email-verification/verification.repo';

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

  describe('JwtAuthRole', () => {
    const guard = new JwtAuthRole();

    it('should allow access for a superAdmin user', () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({ user: { role: 'superAdmin' } }),
        }),
      } as any;

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should deny access when user is missing', () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({ user: null }),
        }),
      } as any;

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(context)).toThrow(
        'You do not have permission to access this resource',
      );
    });

    it('should deny access when user role is not superAdmin', () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({ user: { role: 'admin' } }),
        }),
      } as any;

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(context)).toThrow(
        'You do not have permission to access this resource',
      );
    });
  });

  describe('RolesGuard', () => {
    it('should allow access when the required role matches the user role', () => {
      const reflector = {
        getAllAndOverride: jest.fn().mockReturnValue(['superAdmin']),
      } as unknown as Reflector;
      const guard = new RolesGuard(reflector);
      const context = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: () => ({
          getRequest: () => ({ user: { role: 'superAdmin' } }),
        }),
      } as any;

      expect(guard.canActivate(context)).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalled();
    });

    it('should return true when no roles metadata is present', () => {
      const reflector = {
        getAllAndOverride: jest.fn().mockReturnValue(undefined),
      } as unknown as Reflector;
      const guard = new RolesGuard(reflector);
      const context = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: () => ({
          getRequest: () => ({ user: { role: 'superAdmin' } }),
        }),
      } as any;

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should deny access when user does not have a required role', () => {
      const reflector = {
        getAllAndOverride: jest.fn().mockReturnValue(['superAdmin', 'admin']),
      } as unknown as Reflector;
      const guard = new RolesGuard(reflector);
      const context = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: () => ({
          getRequest: () => ({ user: { role: 'user' } }),
        }),
      } as any;

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(context)).toThrow('Access denied');
    });

    it('should deny access when user is missing', () => {
      const reflector = {
        getAllAndOverride: jest.fn().mockReturnValue(['admin']),
      } as unknown as Reflector;
      const guard = new RolesGuard(reflector);
      const context = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: () => ({
          getRequest: () => ({ user: null }),
        }),
      } as any;

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(context)).toThrow('Access denied');
    });
  });

  describe('VerificationRepo', () => {
    let repo: VerificationRepo;
    const pool = {
      query: jest.fn(),
    } as any;

    beforeEach(() => {
      repo = new VerificationRepo(pool);
      jest.clearAllMocks();
    });

    it('should update the customer with a verification token and expiry', async () => {
      const expiresAt = new Date('2026-01-01T00:00:00.000Z');
      const data = {
        userId: 7,
        tokenHash: 'token-hash',
        expiresAt,
      };

      await repo.addingVerificationToDB(data);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE customers'),
        [7, 'token-hash', expiresAt],
      );
    });

    it('should return the customer id when a valid unverified token matches', async () => {
      pool.query.mockResolvedValue({ rows: [{ customer_id: 7 }] });

      await expect(repo.compareTokens('token-hash')).resolves.toBe(7);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE customers'),
        ['token-hash'],
      );
    });

    it('should return null when no valid matching token is found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      await expect(repo.compareTokens('missing-token')).resolves.toBeNull();
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE customers'),
        ['missing-token'],
      );
    });
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

      expect(await controller.login(loginData)).toEqual({
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

      expect(res.clearCookie).toHaveBeenCalledWith(
        'access_token',
        'refresh_token',
      );
      // expect(res.clearCookie).toHaveBeenCalledWith('refresh_token');
      expect(result).toEqual({ message: 'Logged out' });
    });
  });
});
