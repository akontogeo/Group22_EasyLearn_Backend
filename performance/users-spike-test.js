import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, COMMON_THRESHOLDS, SPIKE_TEST_CONFIG, THINK_TIME } from './config.js';

/**
 * Spike Test for /users endpoint
 *
 * Purpose: Sudden traffic surge (spike) and recovery
 * NFRs (enforced via thresholds in config.js):
 * - Error rate < 1%
 * - P95 response time under configured threshold
 */

export const options = {
  thresholds: COMMON_THRESHOLDS,
  scenarios: {
    users_spike_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: SPIKE_TEST_CONFIG.stages,
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
  console.log('⚡ SPIKE TEST - /users');
  console.log('========================================');
  console.log(`Status: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`P95 Response Time: ${p95?.toFixed(2)}ms`);
  console.log(`Error Rate: ${(failedRate * 100).toFixed(2)}%`);
  console.log('========================================\n');

  return {
    stdout: JSON.stringify(data, null, 2),
  };
}
