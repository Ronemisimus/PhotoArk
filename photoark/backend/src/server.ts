import Fastify, { FastifyInstance } from 'fastify';
import fastifyEnv from '@fastify/env';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import healthRoutes from './routes/health.js';
import mediaRoutes from './routes/media.js';
import { swaggerOptions, swaggerUiOptions } from './swagger';

// Initialize Fastify
const fastify: FastifyInstance = Fastify({
  logger: true,
});

// Define the schema for environment variables
const schema = {
  type: 'object',
  required: ['PORT'],
  properties: {
    PORT: {
      type: 'string',
      default: 3000,
    },
  },
};

// Register the environment variables plugin
await fastify.register(fastifyEnv, {
  schema: schema,
  dotenv: true,
});

// Register Swagger
await fastify.register(swagger, swaggerOptions);
await fastify.register(swaggerUi, swaggerUiOptions);

// Register routes
fastify.register(healthRoutes);
fastify.register(mediaRoutes);

// Export the fastify instance for testing
export default fastify;
