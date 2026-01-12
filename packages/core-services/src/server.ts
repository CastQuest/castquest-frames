import cors from 'cors';
import express, { Express, NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { config } from './lib/config';
import { checkDatabaseHealth, closeDatabase } from './lib/db';
import { logger } from './lib/logger';

// Import route modules
import { marketRoutes } from './modules/markets/routes';
import { mediaRoutes } from './modules/media/routes';
import { riskRoutes } from './modules/risk/routes';
import { userRoutes } from './modules/users/routes';
import { walletRoutes } from './modules/wallets/routes';

const app: Express = express();

// ============================================================================
// Middleware
// ============================================================================

// Security headers
app.use(helmet());

// CORS
app.use(cors({
  origin: config.env === 'production' 
    ? ['https://castquest.xyz', 'https://admin.castquest.xyz']
    : '*',
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.http(`${req.method} ${req.path}`);
  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(`/api/${config.apiVersion}`, limiter);

// ============================================================================
// Health Check
// ============================================================================

app.get('/health', async (req: Request, res: Response) => {
  const dbHealthy = await checkDatabaseHealth();
  
  const health = {
    status: dbHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbHealthy ? 'connected' : 'disconnected',
    version: config.apiVersion,
  };
  
  res.status(dbHealthy ? 200 : 503).json(health);
});

// ============================================================================
// API Routes
// ============================================================================

const apiRouter = express.Router();

// Mount module routes
apiRouter.use('/users', userRoutes);
apiRouter.use('/wallets', walletRoutes);
apiRouter.use('/media', mediaRoutes);
apiRouter.use('/markets', marketRoutes);
apiRouter.use('/risk', riskRoutes);

// Mount API router
app.use(`/api/${config.apiVersion}`, apiRouter);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    service: 'CastQuest Core Services',
    version: config.apiVersion,
    documentation: `/api/${config.apiVersion}/docs`,
    health: '/health',
  });
});

// ============================================================================
// Error Handling
// ============================================================================

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found',
    },
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error('Unhandled error:', err);
  
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: config.env === 'production' 
        ? 'An internal error occurred' 
        : err.message,
    },
  });
});

// ============================================================================
// Server Startup
// ============================================================================

const startServer = async () => {
  try {
    // Check database connection
    const dbHealthy = await checkDatabaseHealth();
    if (!dbHealthy) {
      throw new Error('Database connection failed');
    }
    
    // Start listening
    const server = app.listen(config.port, () => {
      logger.info(`🚀 CastQuest Core Services started`);
      logger.info(`📍 Environment: ${config.env}`);
      logger.info(`🌐 Port: ${config.port}`);
      logger.info(`📡 API: http://localhost:${config.port}/api/${config.apiVersion}`);
      logger.info(`❤️  Health: http://localhost:${config.port}/health`);
    });
    
    // Graceful shutdown
    const shutdown = async () => {
      logger.info('Shutting down gracefully...');
      
      server.close(async () => {
        logger.info('HTTP server closed');
        await closeDatabase();
        process.exit(0);
      });
      
      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };
    
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start if this is the main module
if (require.main === module) {
  startServer();
}

export { app, startServer };
