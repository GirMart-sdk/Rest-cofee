/**
 * @swagger
 * /api/orders:
 *   get:
 *     tags: [Orders]
 *     summary: List orders
 *     description: List orders with optional filters. Authenticated users see their own orders; admins see all.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: orderType
 *         schema:
 *           type: string
 *           enum: [domicilio, tienda, mesa]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, preparing, ready, out_for_delivery, delivered, cancelled]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *   post:
 *     tags: [Orders]
 *     summary: Create an order
 *     description: Create a new order. Anonymous (table) or authenticated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items, customerName, customerPhone, orderType]
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     menuItemId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *               customerName:
 *                 type: string
 *               customerPhone:
 *                 type: string
 *               orderType:
 *                 type: string
 *                 enum: [domicilio, tienda, mesa]
 *               tableId:
 *                 type: string
 *               address:
 *                 type: string
 *               deliveryZone:
 *                 type: string
 *                 enum: [centro, periurbano, lejano]
 *               paymentMethod:
 *                 type: string
 *                 enum: [wompi, cash, nequi, daviplata]
 *
 * /api/orders/{id}:
 *   patch:
 *     tags: [Orders]
 *     summary: Update order status
 *     description: Update the status of an order. Admin only.
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
 *               status:
 *                 type: string
 *                 enum: [pending, preparing, ready, out_for_delivery, delivered, cancelled]
 *
 * /api/orders/events:
 *   get:
 *     tags: [Orders]
 *     summary: SSE real-time order events
 *     description: Server-Sent Events stream for real-time order updates. Admin only. Token passed via query parameter.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT access token (EventSource does not support custom headers)
 */
