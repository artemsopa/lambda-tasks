import AWS from 'aws-sdk';
import { APIGatewayProxyHandler, SQSHandler } from 'aws-lambda';
import initConfigs from './config';

const configs = initConfigs();
const sqs = new AWS.SQS();

const sender: APIGatewayProxyHandler = async (event) => {
  console.log(configs);
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

  const queueUrl = `https://sqs.${configs.queue.REGION}.amazonaws.com/${configs.queue.ACCOUNT_ID}/${configs.queue.QUEUE_NAME}`;

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

const receiver: SQSHandler = async (event) => {
  try {
    for (const record of event.Records) {
      const { messageAttributes } = record;
      console.log('Message Attributtes -->  ', messageAttributes.AttributeNameHere.stringValue);
      console.log('Message Body -->  ', record.body);
      // Do something
    }
  } catch (error) {
    console.log(error);
  }
};

export {
  sender,
  receiver,
};
