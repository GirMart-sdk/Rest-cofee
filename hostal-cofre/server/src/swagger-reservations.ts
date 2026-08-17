/**
 * @swagger
 * /api/reservations:
 *   get:
 *     tags: [Reservations]
 *     summary: List reservations
 *     description: List reservations. Admin sees all; clients see their own.
 *     security:
 *       - bearerAuth: []
 *   post:
 *     tags: [Reservations]
 *     summary: Create a reservation
 *     description: Create a new reservation. Authenticated or anonymous.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, phone, date, time, guests]
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *               guests:
 *                 type: integer
 *               notes:
 *                 type: string
 *               tableId:
 *                 type: string
 */
