import { APIGatewayEvent } from 'aws-lambda';
import middy from '@middy/core';
import validator from '@middy/validator';
import JSONErrorHandlerMiddleware from 'middy-middleware-json-error-handler';
import httpEventNormalizer from '@middy/http-event-normalizer';
import Joi from '@hapi/joi';
import Boom from '@hapi/boom';

const nameSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .required(),
});

const hello = async (event: APIGatewayEvent) => {
  const { error, value } = nameSchema.validate(event.queryStringParameters);
  if (error) {
    return {
      statusCode: 422,
      body: JSON.stringify(Boom.badData(error.message).output),
    };
  }
  return {
    statusCode: 200,
    body: `Hello, ${value.name}!`,
  };
};

const inputSchema = {
  type: 'object',
  required: ['queryStringParameters'],
  properties: {
    queryStringParameters: {
      type: 'object',
      required: ['name'],
      properties: {
        name: {
          type: 'string',
        },
      },
    },
  },
};

export const handler = middy(hello)
  .use(JSONErrorHandlerMiddleware())
  .use(httpEventNormalizer())
  .use(validator({
    inputSchema,
  }));
