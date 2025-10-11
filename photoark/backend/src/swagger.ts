export const swaggerOptions = {
  swagger: {
    info: {
      title: 'PhotoArk Backend API',
      description: 'API documentation for the PhotoArk backend service.',
      version: '1.0.0',
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here',
    },
    host: 'localhost:3000',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
};

export const swaggerUiOptions = {
  routePrefix: '/docs',
  exposeRoute: true,
};
