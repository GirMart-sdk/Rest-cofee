/**
 * @swagger
 * /api/payments/create-transaction:
 *   post:
 *     tags: [Payments]
 *     summary: Create a Wompi payment transaction
 *     description: Initiate a payment via Wompi gateway. Authenticated users only.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [orderId]
 *             properties:
 *               orderId:
 *                 type: string
 *               customer_email:
 *                 type: string
 *               payment_method:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [CARD, BANCOLOMBIA_TRANSFER, PSE, NEQUI]
 *
 * /api/payments/webhook:
 *   post:
 *     tags: [Payments]
 *     summary: Wompi webhook receiver
 *     description: Receives payment event notifications from Wompi. Validates signature with WOMPI_EVENTS_SECRET.
 *     responses:
 *       200:
 *         description: Webhook processed
 */
