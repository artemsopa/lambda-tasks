import AWS from 'aws-sdk';
import { APIGatewayProxyHandler } from 'aws-lambda';
import initConfigs from './config';

const configs = initConfigs();
const sqs = new AWS.SQS();

const sender: APIGatewayProxyHandler = async (event) => {
  let statusCode = 200;
  let message = 'Message placed in the Queue!';

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Body is not found',
      }),
    };
  }

  const region = configs.REGION;
  const accountId = configs.ACCOUNT_ID;
  const queueName = configs.QUEUE_NAME;

  const queueUrl = `https://sqs.${region}.amazonaws.com/${accountId}/${queueName}`;

  try {
    await sqs.sendMessage({
      QueueUrl: queueUrl,
      MessageBody: event.body,
      MessageAttributes: {
        AttributeNameHere: {
          StringValue: 'Attribute Value Here',
          DataType: 'String',
        },
      },
    }).promise();
  } catch (error) {
    console.log(error);
    statusCode = 500;
    message = 'Cannot place message in the Queue!';
  }

  return {
    statusCode,
    body: JSON.stringify({
      message,
    }),
  };
};

export default sender;
