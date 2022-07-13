import { APIGatewayEvent } from 'aws-lambda';
import Boom from '@hapi/boom';
import Joi from 'joi';
import middy from '@middy/core';
// import validator from '@middy/validator';

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

export const handler = middy(hello);
