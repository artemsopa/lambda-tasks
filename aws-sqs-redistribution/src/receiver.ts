import { SQSHandler } from 'aws-lambda';

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

export default receiver;
