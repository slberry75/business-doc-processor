import { Request, Response } from 'express';
import { AuthController } from '../../src/controllers/auth.controller';
import { createMockRequest, createMockResponse } from '../utils/mockHelpers';

describe('AuthController Registration Validation', () => {
  let authController: AuthController;

  beforeEach(() => {
    authController = new AuthController();
  });

  describe('Registration Validation', () => {
    it('should reject registration with invalid email format', async () => {
      // Arrange
      const req = createMockRequest({
        email: 'invalid-email',
        password: 'ValidPass123!'
      }) as Request;
      const res = createMockResponse();

      // Act
      await authController.register(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringMatching(/email/i)
        })
      );
    });

    it('should reject registration with weak password', async () => {
      // Arrange
      const req = createMockRequest({
        email: 'test@example.com',
        password: 'weak'
      }) as Request;
      const res = createMockResponse();

      // Act
      await authController.register(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringMatching(/password/i)
        })
      );
    });

    it('should accept registration with valid email and strong password', async () => {
      // Arrange
      const req = createMockRequest({
        email: 'test@example.com',
        password: 'StrongPass123!'
      }) as Request;
      const res = createMockResponse();

      // Act
      await authController.register(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          token: expect.any(String),
          user: expect.objectContaining({
            email: 'test@example.com'
          })
        })
      );
    });
  });
});
