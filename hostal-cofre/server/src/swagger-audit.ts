/**
 * @swagger
 * /api/audit:
 *   get:
 *     tags: [Audit]
 *     summary: List audit logs
 *     description: Get recent audit logs with optional filters. Admin only.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 200
 *           default: 50
 *       - in: query
 *         name: resource
 *         schema:
 *           type: string
 *         description: Filter by resource type (e.g. menu, order, shift)
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *         description: Filter by action (e.g. menu.create, order.update)
 */
