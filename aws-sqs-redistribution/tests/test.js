import http from 'k6/http';
import { check } from 'k6';
import { Counter, Rate } from 'k6/metrics';

const tokens = [
  'token1',
  'token2',
  'token3',
  'token4',
  'token5',
];

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const ErrorCount = new Counter('errors');
const ErrorRate = new Rate('error_rate');

export const options = {
  vus: 10,
  duration: '1s',
  target: 1000,
};

export default () => {
  const res = http.post('http://localhost:3000/v1/sender', {
    token: tokens[getRandomInt(1, 5)],
  });
  const success = check(res, {
    'status is 200': (r) => r.status === 200,
  });
  if (!success) {
    ErrorCount.add(1);
    ErrorRate.add(true);
  } else {
    ErrorRate.add(false);
  }
  // sleep(0.5);
};
