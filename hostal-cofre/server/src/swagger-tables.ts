/**
 * @swagger
 * /api/tables:
 *   get:
 *     tags: [Tables]
 *     summary: List all tables
 *     description: List all tables with current status. Public.
 *     responses:
 *       200:
 *         description: List of tables
 *
 * /api/tables/active:
 *   get:
 *     tags: [Tables]
 *     summary: List tables with active orders
 *     description: Admin only.
 *     security:
 *       - bearerAuth: []
 *
 * /api/tables:
 *   post:
 *     tags: [Tables]
 *     summary: Create a table
 *     description: Admin only.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [number, capacity, zone]
 *             properties:
 *               number:
 *                 type: integer
 *               capacity:
 *                 type: integer
 *               zone:
 *                 type: string
 *                 enum: [interior, exterior, privado]
 *
 * /api/tables/{id}:
 *   put:
 *     tags: [Tables]
 *     summary: Update a table
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *   delete:
 *     tags: [Tables]
 *     summary: Delete a table
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
