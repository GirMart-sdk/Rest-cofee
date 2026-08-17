import swaggerJsdoc from 'swagger-jsdoc'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hostal Cofee API',
      version: '2.0.0',
      description: 'API REST para el sistema de gestión del restaurante Hostal Cofee',
      contact: { name: 'Hostal Cofee Team' },
    },
    servers: [{ url: '/api', description: 'API base' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      responses: {
        Unauthorized: { description: 'Token de autenticación requerido o inválido' },
        Forbidden: { description: 'No tiene permisos para acceder a este recurso' },
        NotFound: { description: 'Recurso no encontrado' },
        ValidationError: { description: 'Error de validación en los datos enviados' },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [
    path.join(__dirname, 'swagger-*.ts'),
    path.join(__dirname, 'routes', '*.ts'),
    path.join(__dirname, 'index.ts'),
  ],
}

export const swaggerSpec = swaggerJsdoc(options)
