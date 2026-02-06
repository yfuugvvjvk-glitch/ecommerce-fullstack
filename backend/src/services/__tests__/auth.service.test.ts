import { AuthService } from '../auth.service';
import { PrismaClient } from '@prisma/client';

// Mock the entire auth utils module
jest.mock('../../utils/auth', () => ({
  hashPassword: jest.fn().mockResolvedValue('hashedPassword'),
  comparePassword: jest.fn().mockResolvedValue(true),
  generateToken: jest.fn().mockReturnValue('mockToken'),
  verifyToken: jest.fn().mockReturnValue({ userId: '1', email: 'test@example.com', role: 'user' }),
}));

// Mock Prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  })),
}));

const mockPrisma = new PrismaClient() as jest.Mocked<PrismaClient>;

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should create a new user with hashed password', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
        role: 'user',
        phone: null,
        address: null,
        avatar: null,
        locale: 'ro',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (mockPrisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.register(
        'test@example.com',
        'password123',
        'Test User'
      );

      expect(result.email).toBe('test@example.com');
      expect(mockPrisma.user.create).toHaveBeenCalled();
    });

    it('should throw error if user already exists', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1', email: 'test@example.com' });

      await expect(
        authService.register('test@example.com', 'password123', 'Test User')
      ).rejects.toThrow('User with this email already exists');
    });
  });

  describe('login', () => {
    it('should return token and user on successful login', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        password: '$2b$10$hashedPassword',
        role: 'user',
        phone: null,
        address: null,
        avatar: null,
        locale: 'ro',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.login('test@example.com', 'password123');

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe('test@example.com');
      expect(result.token).toBe('mockToken');
    });

    it('should throw error on invalid credentials', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.login('test@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid email or password');
    });
  });
});
