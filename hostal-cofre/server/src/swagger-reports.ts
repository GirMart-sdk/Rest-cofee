/**
 * @swagger
 * /api/reports/daily:
 *   get:
 *     tags: [Reports]
 *     summary: Daily sales report
 *     description: Get daily sales report with summary, top items, hourly sales, and shifts. Admin only.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Date in YYYY-MM-DD format. Defaults to today.
 *
 * /api/reports/weekly:
 *   get:
 *     tags: [Reports]
 *     summary: Weekly sales summary
 *     description: Get weekly sales summary with daily breakdown. Admin only.
 *     security:
 *       - bearerAuth: []
 */
