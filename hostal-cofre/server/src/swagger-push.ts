/**
 * @swagger
 * /api/push/subscribe:
 *   post:
 *     tags: [Push]
 *     summary: Register push subscription
 *     description: Register a Web Push subscription for notifications.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [endpoint, keys]
 *             properties:
 *               endpoint:
 *                 type: string
 *               keys:
 *                 type: object
 *                 properties:
 *                   p256dh:
 *                     type: string
 *                   auth:
 *                     type: string
 *
 * /api/push/unsubscribe:
 *   post:
 *     tags: [Push]
 *     summary: Remove push subscription
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               endpoint:
 *                 type: string
 *
 * /api/push/test:
 *   post:
 *     tags: [Push]
 *     summary: Send test push notification
 *     description: Send a test notification to all registered subscriptions. Admin only.
 *     security:
 *       - bearerAuth: []
 */
