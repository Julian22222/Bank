import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { mockUsersService } from './users.controller.mock';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    jest.clearAllMocks();

    controller = module.get<UsersController>(UsersController);
  });

  it('Test 1: should return all users', async () => {
    expect(await controller.findAll()).toEqual([
      {
        customer_id: 1,
        first_name: 'Julian',
        last_name: 'Golovens',
        email: 'julian@test.com',
        phone: '123-456-7890',
        customer_address: '123 Main St, Springfield, IL',
        dob: new Date('1995-06-15'),
        created_at: '2026-04-20 20:53:22.314',
      },
      {
        customer_id: 2,
        first_name: 'Tom',
        last_name: 'Simpsons',
        email: 'tomSimpson@gmail.com',
        phone: '123-456-7890',
        customer_address: '456 Main St, Springfield, IL',
        dob: new Date('1985-06-15'),
        created_at: '2025-04-20 20:53:22.314',
      },
    ]);
  });

  it('Test 2: should return one user', async () => {
    const userId = 1;

    expect(await controller.findOne(userId)).toEqual({
      customer_id: 1,
      first_name: 'Julian',
      last_name: 'Golovens',
      email: 'julian@test.com',
      phone: '123-456-7890',
      customer_address: '123 Main St, Springfield, IL',
      dob: new Date('1995-06-15'),
      created_at: '2026-04-20 20:53:22.314',
    });

    expect(mockUsersService.findOne).toHaveBeenCalledWith(userId);
  });

  it('Test 3: findOne error hadling - NOT FOUND(404). Should throw error if user not found', async () => {
    const userId = 999;

    mockUsersService.findOne.mockRejectedValue(new Error('User not found'));

    await expect(controller.findOne(userId)).rejects.toThrow('User not found');
  });

  it('Test 4: CREATE - should create a new user and return this new user', async () => {
    const newUser = {
      first_name: 'Bill',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      password: 'mypassword',
      phone: '123456789',
      customer_address: 'Manchester, UK',
      dob: new Date('1990-01-01'),
    };

    expect(await controller.create(newUser)).toEqual({
      customer_id: 3,
      first_name: 'Bill',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone: '123456789',
      customer_address: 'Manchester, UK',
      dob: new Date('1990-01-01'),
      created_at: '2026-04-20 20:53:22.314',
    });
  });

  //error hadling
  it('Test 5: should throw error on create failure', async () => {
    mockUsersService.create.mockRejectedValue(new Error('Create failed'));

    await expect(controller.create({} as CreateUserDto)).rejects.toThrow(
      'Create failed',
    );
  });

  it('Test 6: UPDATE. should update a user and return details of Updated User', async () => {
    const userId = 3;

    const updatedUser = {
      first_name: 'Bill',
      last_name: 'McDoe',
      email: 'john.doe@example.com',
      phone: '123456789',
      customer_address: 'Manchester, UK',
      dob: new Date('1990-01-01'),
      created_at: '2026-04-20 20:53:22.314',
    };

    const result = await controller.updateUserDetails(userId, updatedUser);

    expect(result).toEqual({
      customer_id: 3,
      first_name: 'Bill',
      last_name: 'McDoe',
      email: 'john.doe@example.com',
      phone: '123456789',
      customer_address: 'Manchester, UK',
      dob: new Date('1990-01-01'),
      created_at: '2026-04-20 20:53:22.314',
    });
  });

  it('Test 7: UPDATE - error hadling. should update a user and return details of Updated User', async () => {
    const userId = 999;

    const updatedUser = {
      first_name: 'Bill',
      last_name: 'McDoe',
      email: 'john.doe@example.com',
      phone: '123456789',
      customer_address: 'Manchester, UK',
      dob: new Date('1990-01-01'),
    };

    mockUsersService.update.mockRejectedValue(new Error('User not found'));

    await expect(
      controller.updateUserDetails(userId, updatedUser),
    ).rejects.toThrow('User not found');
  });

  it('Test 8: REMOVE - should remove a user and return - User removed successfully', async () => {
    const userId = 3;

    expect(await controller.remove(userId)).toBe('User removed successfully');
  });

  it('Test 9: REMOVE -error handling. should remove a user and return - User not found', async () => {
    const userId = 999;

    mockUsersService.remove.mockRejectedValue(new Error('User not found'));

    await expect(controller.remove(userId)).rejects.toThrow('User not found');
  });
});
