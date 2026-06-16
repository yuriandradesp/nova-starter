import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
}));

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should update profile successfully without password', async () => {
    mockPrismaService.user.update.mockResolvedValue({
      id: 'user-1',
      name: 'New Name',
      email: 'new@example.com',
      password: 'old_hashed_password',
    });

    const result = await service.updateProfile('user-1', {
      name: 'New Name',
      email: 'new@example.com',
    });

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { name: 'New Name', email: 'new@example.com' },
    });
    expect(result).toEqual({
      id: 'user-1',
      name: 'New Name',
      email: 'new@example.com',
    });
  });

  it('should hash password if provided', async () => {
    mockPrismaService.user.update.mockResolvedValue({
      id: 'user-1',
      name: 'Test',
      email: 'test@example.com',
      password: 'hashed_password',
    });

    await service.updateProfile('user-1', {
      password: 'new_password',
    });

    expect(bcrypt.hash).toHaveBeenCalledWith('new_password', 10);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { password: 'hashed_password' },
    });
  });

  it('should throw BadRequestException if email is already in use by another user', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue({
      id: 'user-2', // Different ID means another user
      email: 'existing@example.com',
    });

    await expect(
      service.updateProfile('user-1', { email: 'existing@example.com' })
    ).rejects.toThrow(BadRequestException);
  });

  it('should not throw if the existing email belongs to the same user', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue({
      id: 'user-1', // Same ID means same user
      email: 'my@example.com',
    });
    mockPrismaService.user.update.mockResolvedValue({
      id: 'user-1',
      name: 'Test',
      email: 'my@example.com',
    });

    await service.updateProfile('user-1', { email: 'my@example.com' });
    expect(prisma.user.update).toHaveBeenCalled();
  });
});
