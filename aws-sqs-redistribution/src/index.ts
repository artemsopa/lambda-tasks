import middy from '@middy/core';
import sender from './sender';
import receiver from './receiver';

export default {
  sender: middy(sender),
  receiver: middy(receiver),
} as const;
