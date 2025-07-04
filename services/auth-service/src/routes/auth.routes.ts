import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { registerSchema, loginSchema } from '../validation/auth.validation';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req,res) => authController.login(req, res));

// Protected routes
router.get('/profile', authenticateToken, (req, res) => authController.getProfile(req, res));

export default router;