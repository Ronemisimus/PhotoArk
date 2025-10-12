import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { generateUploadUrl } from '../lib/s3.js';
import crypto from 'crypto';

/**
 * Media routes for the service.
 * @param {FastifyInstance} fastify
 * @param {object} options
 */
export default async function mediaRoutes(fastify: FastifyInstance, options: object) {
  // --- Database interaction logic will go here ---
  // For now, we'll use an in-memory array as a mock database.
  const mockDb = [];
  // ------------------------------------------------

  const mediaSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      url: { type: 'string', format: 'uri' },
      thumbnailUrl: { type: 'string', format: 'uri' },
      title: { type: 'string' },
      description: { type: 'string' },
      mediaType: { type: 'string', enum: ['photo', 'video'] },
      createdAt: { type: 'string', format: 'date-time' },
    },
  };

  const getMediaSchema = {
    response: {
      200: {
        type: 'array',
        items: mediaSchema,
      },
    },
  };

  fastify.get('/media', { schema: getMediaSchema }, async (request: FastifyRequest, reply: FastifyReply) => {
    // In a real app, you would fetch this from the database.
    reply.send(mockDb);
  });

  const postUploadUrlSchema = {
    body: {
      type: 'object',
      required: ['filename', 'mediaType'],
      properties: {
        filename: { type: 'string' },
        thumbnailFilename: { type: 'string' },
        mediaType: { type: 'string', enum: ['photo', 'video'] },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          uploadUrl: { type: 'string', format: 'uri' },
          thumbnailUploadUrl: { type: 'string', format: 'uri' },
          mediaUrl: { type: 'string', format: 'uri' },
          thumbnailUrl: { type: 'string', format: 'uri' },
        },
      },
    },
  };

  fastify.post('/media/upload-url', { schema: postUploadUrlSchema }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { filename, thumbnailFilename } = request.body as any;
    const randomId = crypto.randomBytes(16).toString('hex');
    const mediaKey = `uploads/${randomId}-${filename}`;
    const thumbnailKey = `thumbnails/${randomId}-${thumbnailFilename}`;

    try {
      const [uploadUrl, thumbnailUploadUrl] = await Promise.all([
        generateUploadUrl(mediaKey),
        generateUploadUrl(thumbnailKey),
      ]);

      // These are the URLs the media will be accessible at after upload.
      // In a real app, this would come from a CDN or S3 public URL.
      const mediaUrl = `http://example.com/${mediaKey}`;
      const thumbnailUrl = `http://example.com/${thumbnailKey}`;

      reply.send({ uploadUrl, thumbnailUploadUrl, mediaUrl, thumbnailUrl });
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({ error: 'Failed to generate upload URLs' });
    }
  });

  const postMediaSchema = {
    body: {
      type: 'object',
      required: ['title', 'url', 'thumbnailUrl', 'mediaType'],
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        url: { type: 'string', format: 'uri' },
        thumbnailUrl: { type: 'string', format: 'uri' },
        mediaType: { type: 'string', enum: ['photo', 'video'] },
      },
    },
    response: {
      201: mediaSchema,
    },
  };

  fastify.post('/media', { schema: postMediaSchema }, async (request: FastifyRequest, reply: FastifyReply) => {
    // In a real app, you would save this to the database.
    const body = request.body as any;
    const newMedia = {
      id: crypto.randomBytes(16).toString('hex'),
      ...body,
      createdAt: new Date().toISOString(),
    };
    mockDb.push(newMedia);
    reply.code(201).send(newMedia);
  });

  const getMediaSchemaById = {
    params: {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
    },
    response: {
      200: mediaSchema,
    },
  };

  fastify.get('/media/:id', { schema: getMediaSchemaById }, async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as { id: string };
    // In a real app, you would fetch this from the database.
    const media = mockDb.find(m => m.id === params.id);
    if (media) {
      reply.send(media);
    } else {
      reply.code(404).send({ error: 'Media not found' });
    }
  });

  const deleteMediaSchema = {
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

  fastify.delete('/media/:id', { schema: deleteMediaSchema }, async (request: FastifyRequest, reply: FastifyReply) => {
    // In a real app, you would delete this from the database.
    const params = request.params as { id: string };
    const index = mockDb.findIndex(m => m.id === params.id);
    if (index > -1) {
      mockDb.splice(index, 1);
    }
    reply.code(204).send();
  });
}
