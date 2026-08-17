/**
 * @swagger
 * /api/shifts:
 *   get:
 *     tags: [Shifts]
 *     summary: List all shifts
 *     description: List all shifts. Admin only.
 *     security:
 *       - bearerAuth: []
 *
 * /api/shifts/current:
 *   get:
 *     tags: [Shifts]
 *     summary: Get current open shifts
 *     security:
 *       - bearerAuth: []
 *
 * /api/shifts/open:
 *   post:
 *     tags: [Shifts]
 *     summary: Open a new shift
 *     description: Open a new cashier shift. Admin only.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cashierName, shiftPeriod, openingCash]
 *             properties:
 *               cashierName:
 *                 type: string
 *               shiftPeriod:
 *                 type: string
 *                 enum: [manana, medio_dia, tarde, noche]
 *               openingCash:
 *                 type: number
 *               notes:
 *                 type: string
 *
 * /api/shifts/{id}/close:
 *   post:
 *     tags: [Shifts]
 *     summary: Close a shift
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               closingCash:
 *                 type: number
 *               notes:
 *                 type: string
 */
