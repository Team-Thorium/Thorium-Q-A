import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter } from 'k6/metrics';

export const request = new Counter('http_reqs');

export const options = {
  vus: 1000,
  duration: '15s',
  thresholds: {
    http_reqs: ['count < 100'],
  },
};

const url = 'http://localhost:3000/qa/questions/1/answers';

export default () => {
  const res = http.get(url);
  sleep(1);

  check(res, {
    'is status 200': (r) => r.status === 200,
    'transaction time < 1000ms': (r) => r.timings.duration < 1000,
  });
};
