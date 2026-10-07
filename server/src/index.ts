import express from 'express';
import path from 'path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import authRoutes from './routes/auth';
import prisma from './db';
import { validateEnv } from './env';

// Validate environment variables
const env = validateEnv();

const app = express();
const server = createServer(app);
const PORT = env.PORT;
const NODE_ENV = env.NODE_ENV;
const IS_PROD = NODE_ENV === 'production';

// Trust proxy for rate limiting when behind Render/proxy
app.set('trust proxy', true);

// Middleware
app.use(helmet({
  contentSecurityPolicy: IS_PROD ? undefined : false,
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Serve static files from React build in production
if (IS_PROD) {
  const clientDistPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDistPath));

  // SPA fallback - serve index.html for all non-API routes
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path === '/health') {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Routes
app.use('/api/auth', authRoutes);

// Health check with database connection
app.get('/health', async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
      environment: NODE_ENV
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      environment: NODE_ENV
    });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Vaultoria server running on port ${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
  if (IS_PROD) {
    console.log(`Serving frontend from ${path.join(__dirname, '../../client/dist')}`);
  }
});
