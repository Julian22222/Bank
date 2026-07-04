import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { mockUsersService } from './users.controller.mock';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get(UsersController);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await module.close();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      expect(await controller.findAll()).toEqual([
        {
          customer_id: 1,
          first_name: 'Julian',
          last_name: 'Golovens',
          email: 'julian@test.com',
          phone: '123-456-7890',
          customer_address: '123 Main St, Springfield, IL',
          dob: '1995-06-15',
          phone_verified: false,
          email_verified: false,
          created_at: '2026-04-20 20:53:22',
        },
        {
          customer_id: 2,
          first_name: 'Tom',
          last_name: 'Simpsons',
          email: 'tomSimpson@gmail.com',
          phone: '123-456-7890',
          customer_address: '456 Main St, Springfield, IL',
          dob: '1985-06-15',
          phone_verified: false,
          email_verified: false,
          created_at: '2025-04-20 20:53:22',
        },
      ]);
    });
  });

  describe('findOne', () => {
    const userId = 1;

    it('should return one user', async () => {
      const result = await controller.findOne(userId);
      expect(result).toEqual({
        customer_id: 1,
        first_name: 'Julian',
        last_name: 'Golovens',
        email: 'julian@test.com',
        phone: '123-456-7890',
        customer_address: '123 Main St, Springfield, IL',
        dob: '1995-06-15',
        phone_verified: false,
        email_verified: false,
        created_at: '2026-04-20 20:53:22',
      });
    });

    it('should call findOne with the correct userId', async () => {
      const result = await controller.findOne(userId);

      expect(mockUsersService.findOne).toHaveBeenCalledWith(userId);
      expect(result.customer_id).toBe(userId);
    });

    it('should have the correct email for the user', async () => {
      const result = await controller.findOne(userId);

      expect(result.email).toBeDefined();
    });

    it('findOne error hadling - NOT FOUND(404). Should throw error if user not found', async () => {
      const userId = 999;

      mockUsersService.findOne.mockRejectedValue(new Error('User not found'));

      await expect(controller.findOne(userId)).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('create', () => {
    const newUser = {
      first_name: 'Bill',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      password: 'mypassword',
      phone: '123456789',
      customer_address: 'Manchester, UK',
      dob: '1990-01-01',
    };

    it('should create a new user and return this new user', async () => {
      const result = await controller.create(newUser);

      expect(result).toEqual({
        customer_id: 3,
        first_name: 'Bill',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone: '123456789',
        customer_address: 'Manchester, UK',
        dob: '1990-01-01',
        phone_verified: false,
        email_verified: false,
        created_at: '2026-04-20 20:53:22',
      });
    });

    it('should call create with the correct newUser data', async () => {
      const result = await controller.create(newUser);

      expect(mockUsersService.create).toHaveBeenCalledWith(newUser);
      expect(result.customer_id).toBeDefined();
    });

    it('should have the correct email for the new user', async () => {
      const result = await controller.create(newUser);

      expect(result.email).toBe(newUser.email);
    });

    it('error handling. should throw error on create failure', async () => {
      mockUsersService.create.mockRejectedValue(new Error('Create failed'));

      await expect(controller.create({} as CreateUserDto)).rejects.toThrow(
        'Create failed',
      );
    });
  });

  describe('update', () => {
    const userId = 3;

    const updatedUser = {
      first_name: 'Bill',
      last_name: 'McDoe',
      email: 'john.doe@example.com',
      phone: '123456789',
      customer_address: 'Manchester, UK',
      dob: '1990-01-01',
      phone_verified: false,
      email_verified: false,
      created_at: '2026-04-20 20:53:22',
    };

    it('should update a user and return details of Updated User', async () => {
      const result = await controller.updateUserDetails(userId, updatedUser);

      expect(result).toEqual({
        customer_id: 3,
        first_name: 'Bill',
        last_name: 'McDoe',
        email: 'john.doe@example.com',
        phone: '123456789',
        customer_address: 'Manchester, UK',
        dob: '1990-01-01',
        phone_verified: false,
        email_verified: false,
        created_at: '2026-04-20 20:53:22',
      });
    });

    it('should call update with the correct userId and updatedUser data', async () => {
      const result = await controller.updateUserDetails(userId, updatedUser);

      expect(mockUsersService.update).toHaveBeenCalledWith(userId, updatedUser);
      expect(result.customer_id).toBe(userId);
    });

    it('should have the correct first name for the updated user', async () => {
      const result = await controller.updateUserDetails(userId, updatedUser);

      expect(result.first_name).toBe(updatedUser.first_name);
    });

    it('error hadling. updating a user and return User not found', async () => {
      const userId = 999;

      mockUsersService.update.mockRejectedValue(new Error('User not found'));

      await expect(
        controller.updateUserDetails(userId, updatedUser),
      ).rejects.toThrow('User not found');
    });
  });

  describe('remove', () => {
    it('should remove a user and return - User removed successfully', async () => {
      const userId = 3;

      expect(await controller.remove(userId)).toBe('User removed successfully');
    });

    it('error handling. should remove a user and return - User not found', async () => {
      const userId = 999;

      mockUsersService.remove.mockRejectedValue(new Error('User not found'));

      await expect(controller.remove(userId)).rejects.toThrow('User not found');
    });
  });
});
