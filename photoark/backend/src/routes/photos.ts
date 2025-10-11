import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

/**
 * Photo routes for the service.
 * @param {FastifyInstance} fastify
 * @param {object} options
 */
export default async function photoRoutes(fastify: FastifyInstance, options: object) {
  const photoSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      url: { type: 'string', format: 'uri' },
      title: { type: 'string' },
      description: { type: 'string' },
      createdAt: { type: 'string', format: 'date-time' },
    },
  };

  const postPhotosSchema = {
    body: {
      type: 'object',
      required: ['title'],
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
      },
    },
    response: {
      201: photoSchema,
    },
  };

  fastify.post('/photos', { schema: postPhotosSchema }, async (request: FastifyRequest, reply: FastifyReply) => {
    // This is a skeleton endpoint. Implementation will be added later.
    reply.code(201).send({
      id: '123',
      url: 'http://example.com/photo.jpg',
      title: (request.body as any).title,
      description: (request.body as any).description,
      createdAt: new Date().toISOString(),
    });
  });

  const getPhotoSchema = {
    params: {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
    },
    response: {
      200: photoSchema,
    },
  };

  fastify.get('/photos/:id', { schema: getPhotoSchema }, async (request: FastifyRequest, reply: FastifyReply) => {
    // This is a skeleton endpoint. Implementation will be added later.
    const params = request.params as { id: string };
    reply.send({
      id: params.id,
      url: 'http://example.com/photo.jpg',
      title: 'A beautiful photo',
      description: 'This is a description of the photo.',
      createdAt: new Date().toISOString(),
    });
  });

  const deletePhotoSchema = {
    params: {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
    },
    response: {
      204: {
        type: 'null',
      },
    },
  };

  fastify.delete('/photos/:id', { schema: deletePhotoSchema }, async (request: FastifyRequest, reply: FastifyReply) => {
    // This is a skeleton endpoint. Implementation will be added later.
    reply.code(204).send();
  });
}
