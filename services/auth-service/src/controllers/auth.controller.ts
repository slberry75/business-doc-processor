import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { RegisterRequest, LoginRequest, AuthResponse } from '../types/auth.types';
import { generateToken } from '../utils/jwt.utils';
import { loginSchema, registerSchema } from '../validation/auth.validation';
import { validateRequest } from '../utils/validation';
import { AuthDataSource } from '../config/database';
import { User } from '../entities/User';
import logger from '../config/logger'
import { Timestamp } from 'typeorm';

export class AuthController {
  
  async register(req: Request<{}, AuthResponse, RegisterRequest>, res: Response<AuthResponse>): Promise<void> {
    const { email, firstName, lastName, password } = req.body;
    try {

      if (!validateRequest(registerSchema, req, res)) {
        return;
      }
      const users = AuthDataSource.getRepository(User);
      // Check if user already exists
      const existingUser = await users.findOne({
        where: { email: email }  
      });
      if (existingUser) {
        res.status(400).json({ error: 'User already exists' } as any);
        logger.auth('Registration failed, user already exists', {
          email: email,
          timestamp: new Date().toISOString() 
        })
        return;
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = new User();
      newUser.email = email;
      newUser.passwordHash = passwordHash;
      newUser.firstName = firstName || null;
      newUser.lastName = lastName || null;

      const savedUser = await users.save(newUser);
      logger.auth('User registered', {
        userId: savedUser.id,
        email: savedUser.email,
        timestamp: new Date().toISOString()
      })
      // Generate JWT token
      const token = generateToken({ userId: savedUser.id, email:savedUser.email });

      // Return response
      res.status(201).json({
        token,
        user: {
          id: savedUser.id,
          email: savedUser.email
        }
      });

      logger.auth('Token generated', {
        userId: savedUser.id,
        email: savedUser.email,
        timestamp: new Date().toISOString() 
      })

    } catch (error:unknown) {
      res.status(500).json({ error: `Registration failed for ${email}` } as any);
      logger.auth('Registration failed', {
        email: email,
        timeStamp: new Date().toISOString()
      })
    }
  }

  async login(req: Request<{}, AuthResponse, LoginRequest>, res: Response<AuthResponse>): Promise<void> {
    const { email, password } = req.body;
    try {
      if (!validateRequest(loginSchema, req, res)) {
        return;
      }
      const users = AuthDataSource.getRepository(User);
      // Find user
      const user = await users.findOne({
        where: { email: email }
      });
      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' } as any);
        logger.auth('Login failed, invalid credentials', {
          email: email,
          timestamp: new Date().toISOString()
        })
        return;
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        res.status(401).json({ error: 'Invalid credentials' } as any);
        logger.auth('Login failed, invalid credentials', {
          email: email,
          timestamp: new Date().toISOString()
        })
        return;
      }

      // Generate JWT token
      const token = generateToken({ userId: user.id, email: user.email });
      logger.auth('Login Token Generated', {
          userId: user.id,
          email: user.email,
          timestamp: new Date().toISOString()
        })
      // Return response
      res.json({
        token,
        user: {
          id: user.id,
          email: user.email
        }
      });
      logger.auth('Login Succeeded', {
        userId: user.id,
        email: user.email,
        timestamp: new Date().toISOString()
      })

    } catch (error) {
      res.status(500).json({ error: 'Login failed' } as any);
      logger.auth('Login failed', {
        email: email,
        timestamp: new Date().toISOString()
      })
    }
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    // req.user is available because middleware validated the token
    res.json({
      message: 'Profile retrieved successfully',
      user: req.user
    });
    logger.auth('Profile retrieved', {
      user: req.user,
      timestamp: new Date().toISOString()
    })
  }
}