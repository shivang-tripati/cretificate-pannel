"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const certificateController_1 = require("../controllers/certificateController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/certificates:
 *   post:
 *     summary: Create a new certificate
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Certificate data
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - issuedTo
 *               - issuedBy
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               issuedTo:
 *                 type: string
 *               issuedBy:
 *                 type: string
 *     responses:
 *       201:
 *         description: Certificate created
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, certificateController_1.create);
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
router.get('/', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, certificateController_1.getOne);
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
router.get('/:id', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, certificateController_1.getOne);
/**
 * @swagger
 * /api/certificates/{id}:
 *   put:
 *     summary: Update a certificate
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
 *     requestBody:
 *       required: true
 *       description: Certificate data to update
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               issuedTo:
 *                 type: string
 *               issuedBy:
 *                 type: string
 *     responses:
 *       200:
 *         description: Certificate updated
 *       404:
 *         description: Certificate not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, certificateController_1.update);
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
router.delete('/:id', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, certificateController_1.remove);
exports.default = router;
