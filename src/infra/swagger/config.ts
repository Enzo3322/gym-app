import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gym App API',
      version: '1.0.0',
      description: 'API for managing gym workouts and exercises',
      contact: {
        name: 'API Support',
        email: 'support@gymapp.example.com'
      }
    },
    servers: [
      {
        url: process.env.BASE_URL || 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        BearerAuth: []
      }
    ]
  },
  apis: [
    './src/infra/routes/*.ts',
    './src/infra/swagger/components/*.yaml'
  ]
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec; 