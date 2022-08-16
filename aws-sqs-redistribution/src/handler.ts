import AWS from 'aws-sdk';
import { APIGatewayProxyHandler, SQSHandler } from 'aws-lambda';
import mysql from 'mysql2';
import initConfigs from './config';

const configs = initConfigs();
const sqs = new AWS.SQS();
const db = mysql.createConnection({
  host: configs.db.DB_HOST,
  port: configs.db.DB_PORT,
  user: configs.db.DB_USER,
  password: configs.db.DB_PASSWORD,
}).promise();

const sender: APIGatewayProxyHandler = async (event) => {
  let statusCode = 200;
  let message = 'Message placed in the Queue!';

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Body is not found' }),
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

  return { statusCode, body: JSON.stringify({ message }) };
};

const receiver: SQSHandler = async (event) => {
  const sql = 'INSERT INTO tokens (token) VALUES (?)';
  try {
    for (const record of event.Records) {
      const { messageAttributes } = record;
      console.log('Message Attributtes -->  ', messageAttributes.AttributeNameHere.stringValue);
      console.log('Message Body -->  ', record.body);
      await db.query(sql, JSON.parse(record.body).token);
    }
  } catch (error) {
    console.log(error);
  }
};

export {
  sender,
  receiver,
};
