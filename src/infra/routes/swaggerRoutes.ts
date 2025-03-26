import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../swagger/config';

export const makeSwaggerRoutes = () => {
  const router = express.Router();
  
  // Serve Swagger UI
  router.use('/', swaggerUi.serve);
  router.get('/', swaggerUi.setup(swaggerSpec));
  
  // Serve Swagger JSON
  router.get('/json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
  return router;
}; 