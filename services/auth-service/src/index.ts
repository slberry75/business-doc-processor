import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
// Routes
app.use('/auth', authRoutes);

// Basic health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'auth-service' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Auth service cooking with gas on port ${PORT}`);
});