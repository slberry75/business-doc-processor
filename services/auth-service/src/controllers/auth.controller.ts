import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { RegisterRequest, LoginRequest, User, AuthResponse } from '../types/auth.types';
import { generateToken } from '../utils/jwt.utils';

// In-memory user storage (we'll replace with database later)
const users: User[] = [];

export class AuthController {
  
  async register(req: Request<{}, AuthResponse, RegisterRequest>, res: Response<AuthResponse>): Promise<void> {
    try {
      const { email, password } = req.body;

      // Check if user already exists
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        res.status(400).json({ error: 'User already exists' } as any);
        return;
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create new user
      const newUser: User = {
        id: uuidv4(),
        email,
        passwordHash,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      users.push(newUser);

      // Generate JWT token
      const token = generateToken({ userId: newUser.id, email: newUser.email });

      // Return response
      res.status(201).json({
        token,
        user: {
          id: newUser.id,
          email: newUser.email
        }
      });

    } catch (error) {
      res.status(500).json({ error: 'Registration failed' } as any);
    }
  }

  async login(req: Request<{}, AuthResponse, LoginRequest>, res: Response<AuthResponse>): Promise<void> {
    try {
      const { email, password } = req.body;

      // Find user
      const user = users.find(u => u.email === email);
      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' } as any);
        return;
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        res.status(401).json({ error: 'Invalid credentials' } as any);
        return;
      }

      // Generate JWT token
      const token = generateToken({ userId: user.id, email: user.email });

      // Return response
      res.json({
        token,
        user: {
          id: user.id,
          email: user.email
        }
      });

    } catch (error) {
      res.status(500).json({ error: 'Login failed' } as any);
    }
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    // req.user is available because middleware validated the token
    res.json({
      message: 'Profile retrieved successfully',
      user: req.user
    });
  }
}