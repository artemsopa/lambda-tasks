import { APIGatewayEvent } from 'aws-lambda';
import Boom from '@hapi/boom';
import Joi from 'joi';
import middy from '@middy/core';
// import validator from '@middy/validator';

const nameSchema = Joi.string().min(3).max(20);

const hello = async (event: APIGatewayEvent) => {
  const { error, value } = nameSchema.validate(event.queryStringParameters?.name);
  if (error) {
    return Boom.badData(error.message);
  }
  return {
    statusCode: 200,
    body: `Hello, ${value}!`,
  };
};

export const handler = middy(hello);
