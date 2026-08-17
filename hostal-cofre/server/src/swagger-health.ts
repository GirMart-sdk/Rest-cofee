/**
 * @swagger
 * /api/health:
 *   get:
 *     tags: [System]
 *     summary: Health check
 *     description: Returns server status. No authentication required.
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
