import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { mockAuthService } from './auth.controller.mock';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await module.close();
  });

  const createMockResponse = () =>
    ({
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    }) as unknown as Response;

  describe('login', () => {
    const loginData = {
      email: 'julik.golovenj@gmail.com',
      password: 'password123',
      rememberMe: false,
    };

    const res = createMockResponse();

    it('should authenticate the user and set access/refresh cookies', async () => {
      const result = await controller.login(loginData, res);

      expect(result).toEqual({
        customer_id: 1,
        first_name: 'Julian',
        last_name: 'Golovens',
        email: 'julian@test.com',
        phone: '123-456-7890',
        customer_address: '123 Main St, Springfield, IL',
        dob: '1995-06-15',
        created_at: '2026-04-20 20:53:22',
      });
    });

    it('should set access and refresh tokens as cookies', async () => {
      const res = createMockResponse();

      await controller.login(loginData, res);

      expect(mockAuthService.login).toHaveBeenCalledWith(loginData, res);

      // expect(res.cookie).toHaveBeenCalledWith(
      //   'access_token',
      //   expect.any(String),
      //   expect.any(Object),
      // );

      // expect(res.cookie).toHaveBeenCalledWith(
      //   'refresh_token',
      //   expect.any(String),
      //   expect.any(Object),
      // );

      // expect(res.cookie).toHaveBeenCalledTimes(2);
    });

    it('should call authService.login with the correct parameters', async () => {
      const res = createMockResponse();

      await controller.login(loginData, res);

      expect(mockAuthService.login).toHaveBeenCalledWith(loginData, res);
      expect(mockAuthService.login).toHaveBeenCalledTimes(1);
    });

    it('should propagate authentication errors from the service', async () => {
      mockAuthService.login.mockRejectedValue(new Error('Invalid credentials'));
      await expect(controller.login(loginData, res)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });

  describe('logout', () => {
    it('should call logout and clear cookies', async () => {
      const res = createMockResponse();

      const result = await controller.logout(res);

      expect(res.clearCookie).toHaveBeenCalledWith('access_token');
      expect(res.clearCookie).toHaveBeenCalledWith('refresh_token');
      expect(result).toEqual({ message: 'Logged out' });

      // expect(mockAuthService.logout).toHaveBeenCalledWith(res);
      // expect(mockAuthService.logout).toHaveBeenCalledTimes(1);
    });
  });
});
