import { Router } from 'express';
import { create, getAll, getOne, update, remove } from '../controllers/certificateController';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware';
import upload from '../config/multer';
const router = Router();

/**
 * @swagger
 * /api/certificates:
 *   post:
 *     summary: Upload a certificate
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               certificate:
 *                 type: string
 *                 format: binary
 *                 description: Certificate file (PDF)
 *               certificateName:
 *                 type: string
 *                 description: Name of the certificate
 *               status:
 *                 type: string
 *                 enum: [valid, invalid]
 *                 description: Status of the certificate
 *     responses:
 *       201:
 *         description: Certificate uploaded successfully
 *       400:
 *         description: Bad request (Missing required fields)
 *       401:
 *         description: Unauthorized
 */
router.post('/create', authMiddleware, adminMiddleware, upload.single('certificate'), create);

/**
 * @swagger
 * /api/certificates:
 *   get:
 *     summary: Get all certificates
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of certificates
 *       401:
 *         description: Unauthorized
 */
router.get('/', authMiddleware, adminMiddleware, getAll);

/**
 * @swagger
 * /api/certificates/{id}:
 *   get:
 *     summary: Get a certificate by ID
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Certificate ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Certificate details
 *       404:
 *         description: Certificate not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', getOne);

/**
 * @swagger
 * /api/certificates/{id}:
 *   put:
 *     summary: Update an existing certificate
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: Certificate ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               certificate:
 *                 type: string
 *                 format: binary
 *                 description: New certificate file (optional)
 *               certificateName:
 *                 type: string
 *                 description: Updated certificate name
 *               status:
 *                 type: string
 *                 enum: [valid, invalid]
 *                 description: Updated status of the certificate
 *     responses:
 *       200:
 *         description: Certificate updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Certificate not found
 */
router.put('/:id', authMiddleware, adminMiddleware, update);

/**
 * @swagger
 * /api/certificates/{id}:
 *   delete:
 *     summary: Delete a certificate
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Certificate ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Certificate deleted
 *       404:
 *         description: Certificate not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', authMiddleware, adminMiddleware, remove);

export default router;
