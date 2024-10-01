import { Router } from 'express';
import { register, login, logout, logoutFromAllDevices } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();


/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       description: User registration data
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               email:
 *                 type: string
 *                 example: 8kCZ3@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               confirmPassword:
 *                 type: string
 *                 example: 123456
 *               role:
 *                 type: string
 *                 example: admin
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request (user already exists or invalid data)
 */

router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       description: User login credentials
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: 8kCZ3@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Bad request (invalid credentials)
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer token for authentication
 *         required: false
 *         schema:
 *           type: string
 *           example: Bearer <JWT_token>
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout from current device
 *     tags: [Auth]
 *     parameters:
 *       - in: cookie
 *         name: Authorization
 *         description: auth_toaken required for logging out
 *         required: true
 *         schema:
 *           type: string
 *           example: auth_toaken <JWT_token>
 *     responses:
 *       200:
 *         description: User logged out from current device successfully
 */
router.post('/logout', authMiddleware, logout);

/**
 * @swagger
 * /api/auth/logout-all:
 *   post:
 *     summary: Logout from all device
 *     tags: [Auth]
 *     parameters:
 *       - in: cookie
 *         name: Authorization
 *         description: auth_toaken required for logging out
 *         required: true
 *         schema:
 *           type: string
 *           example: auth_toaken <JWT_token>
 *     responses:
 *       200:
 *         description: User logged out from all devices successfully
 */
router.post('/logout-all', authMiddleware, logoutFromAllDevices);

export default router;
