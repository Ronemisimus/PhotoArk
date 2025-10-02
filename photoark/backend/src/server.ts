import Fastify, { FastifyInstance } from 'fastify';
import fastifyEnv from '@fastify/env';
import healthRoutes from './routes/health.js';

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

// Register routes
fastify.register(healthRoutes);

// Export the fastify instance for testing
export default fastify;
