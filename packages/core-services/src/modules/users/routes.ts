import { logger } from '@/lib/logger';
import { Request, Response, Router } from 'express';
import { z } from 'zod';
import { UserService } from './service';

const router: Router = Router();
const userService = new UserService();

// ============================================================================
// Validation Schemas
// ============================================================================

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const verifyEmailSchema = z.object({
  token: z.string(),
});

// ============================================================================
// Routes
// ============================================================================

/**
 * POST /api/v1/users/register
 * Register a new user with email and password
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const body = registerSchema.parse(req.body);
    
    const result = await userService.register(body.email, body.password);
    
    res.status(201).json({
      success: true,
      data: {
        user: result.user,
        message: 'Registration successful. Please check your email for verification.',
      },
    });
  } catch (error: any) {
    logger.error('Registration error:', error);
    res.status(400).json({
      success: false,
      error: {
        code: 'REGISTRATION_FAILED',
        message: error.message || 'Registration failed',
      },
    });
  }
});

/**
 * POST /api/v1/users/login
 * Login with email and password
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const body = loginSchema.parse(req.body);
    
    const result = await userService.login(body.email, body.password);
    
    res.json({
      success: true,
      data: {
        user: result.user,
        token: result.token,
      },
    });
  } catch (error: any) {
    logger.error('Login error:', error);
    res.status(401).json({
      success: false,
      error: {
        code: 'LOGIN_FAILED',
        message: error.message || 'Invalid credentials',
      },
    });
  }
});

/**
 * POST /api/v1/users/verify-email
 * Verify email address with token
 */
router.post('/verify-email', async (req: Request, res: Response) => {
  try {
    const body = verifyEmailSchema.parse(req.body);
    
    await userService.verifyEmail(body.token);
    
    res.json({
      success: true,
      data: {
        message: 'Email verified successfully',
      },
    });
  } catch (error: any) {
    logger.error('Email verification error:', error);
    res.status(400).json({
      success: false,
      error: {
        code: 'VERIFICATION_FAILED',
        message: error.message || 'Verification failed',
      },
    });
  }
});

/**
 * GET /api/v1/users/:id
 * Get user profile by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        },
      });
    }
    
    res.json({
      success: true,
      data: { user },
    });
  } catch (error: any) {
    logger.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to retrieve user',
      },
    });
  }
});

/**
 * GET /api/v1/users/email/:email
 * Get user by email
 */
router.get('/email/:email', async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserByEmail(req.params.email);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        },
      });
    }
    
    res.json({
      success: true,
      data: { user },
    });
  } catch (error: any) {
    logger.error('Get user by email error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to retrieve user',
      },
    });
  }
});

export { router as userRoutes };
