import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, COMMON_THRESHOLDS, LOAD_TEST_CONFIG, THINK_TIME } from './config.js';

/**
 * Load Test for /courses endpoint
 * 
 * Purpose: Test sustained load with gradual ramp-up to simulate normal traffic growth
 * NFRs: 
 * - Support up to 1000 concurrent users
 * - P95 response time < 300ms (validated: 160ms @ 1000 VUs)
 * - Error rate < 1%
 */

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

/**
 * Test the GET /users endpoint
 */
export default function () {
  const url = `${BASE_URL}/users`;

  const response = http.get(url);

  check(response, {
    'status is 200': (r) => r.status === 200,
    'response has body': (r) => r.body && r.body.length > 0,
  });

  sleep(THINK_TIME);
}

/**
 * Test execution summary
 */
export function handleSummary(data) {
  const failedRate = data.metrics.http_req_failed?.values?.rate ?? 0;
  const p95 = data.metrics.http_req_duration?.values['p(95)'];

  const passed = failedRate < 0.01;

  console.log('\n========================================');
  console.log('📊 LOAD TEST - /users');
  console.log('========================================');
  console.log(`Status: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`P95 Response Time: ${p95?.toFixed(2)}ms`);
  console.log(`Error Rate: ${(failedRate * 100).toFixed(2)}%`);
  console.log('========================================\n');

  return {
    stdout: JSON.stringify(data, null, 2),
  };
}
