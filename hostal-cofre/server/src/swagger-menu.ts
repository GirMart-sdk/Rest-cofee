/**
 * @swagger
 * /api/menu:
 *   get:
 *     tags: [Menu]
 *     summary: List all menu items
 *     description: Returns all available menu items. No authentication required.
 *     responses:
 *       200:
 *         description: List of menu items
 *   post:
 *     tags: [Menu]
 *     summary: Create a menu item
 *     description: Create a new menu item. Admin only.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price, category]
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 200
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *               price:
 *                 type: number
 *                 minimum: 0
 *               category:
 *                 type: string
 *                 enum: [ensalada, pasta, pizza, postre, bebida]
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Menu item created
 *
 * /api/menu/{id}:
 *   put:
 *     tags: [Menu]
 *     summary: Update a menu item
 *     description: Update an existing menu item. Admin only.
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
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               available:
 *                 type: boolean
 *   delete:
 *     tags: [Menu]
 *     summary: Delete a menu item
 *     description: Delete a menu item. Admin only.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
