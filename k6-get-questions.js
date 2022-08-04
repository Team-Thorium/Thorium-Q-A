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

const url = 'http://localhost:3000/qa/questions';

export default () => {
  const res = http.get(`${url}?product_id=1`);
  sleep(1);

  check(res, {
    'is status 200': (r) => r.status === 200,
  });
};
