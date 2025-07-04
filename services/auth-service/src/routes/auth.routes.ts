import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { RegisterRequest, LoginRequest, User, AuthResponse } from '../types/auth.types';
import { generateToken } from '../utils/jwt.utils';

const router = Router();

// In-memory user storage (we'll replace with database later)
const users: User[] = [];

// Register endpoint
router.post('/register', async (req: Request<{}, AuthResponse, RegisterRequest>, res: Response<AuthResponse>) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' } as any);
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
});

// Login endpoint
router.post('/login', async (req: Request<{}, AuthResponse, LoginRequest>, res: Response<AuthResponse>) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' } as any);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' } as any);
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
});

export default router;