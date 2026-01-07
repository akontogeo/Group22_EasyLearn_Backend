import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, COMMON_THRESHOLDS, LOAD_TEST_CONFIG, THINK_TIME } from './config.js';

/**
 * Load Test for /users/:userId endpoint
 *
 * Purpose: Test sustained load with gradual ramp-up to simulate normal traffic growth
 * NFRs:
 * - Error rate < 1% (enforced via thresholds)
 * - P95 response time under configured threshold (enforced via thresholds)
 */

// Choose a reasonable ID range for your dataset.
// If you don't know how many users exist, keep it small or set via env vars.
const USER_ID_MIN = parseInt(__ENV.USER_ID_MIN || '1', 10);
const USER_ID_MAX = parseInt(__ENV.USER_ID_MAX || '100', 10);

function randomInt(min, max) {
  if (!Number.isFinite(min) || !Number.isFinite(max) || max < min) return 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const options = {
  thresholds: COMMON_THRESHOLDS,
  scenarios: {
    users_load_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: LOAD_TEST_CONFIG.stages,
      gracefulRampDown: '10s',
    },
  },
};

export default function () {
  const userId = randomInt(USER_ID_MIN, USER_ID_MAX);
  const url = `${BASE_URL}/users/${userId}`;

  const response = http.get(url);

  check(response, {
    'status is 200': (r) => r.status === 200,
    'response has body': (r) => r.body && r.body.length > 0,
  });

  sleep(THINK_TIME);
}

export function handleSummary(data) {
  const failedRate = data.metrics.http_req_failed?.values?.rate ?? 0;
  const p95 = data.metrics.http_req_duration?.values['p(95)'];

  const passed = failedRate < 0.01;

  console.log('\n========================================');
  console.log('📊 LOAD TEST - /users/:userId');
  console.log('========================================');
  console.log(`Status: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`P95 Response Time: ${p95?.toFixed(2)}ms`);
  console.log(`Error Rate: ${(failedRate * 100).toFixed(2)}%`);
  console.log('========================================\n');

  return {
    stdout: JSON.stringify(data, null, 2),
  };
}
