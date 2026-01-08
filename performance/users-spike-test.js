import http from 'k6/http';
import { check, sleep } from 'k6';
import { getBaseUrl, getCommonThresholds, getSpikeTestConfig, getThinkTime, setupUserTest, executeUserTest, createUserTestSummary } from './config.js';

/**
 * Spike Test for /users/:userId (valid IDs fetched in setup)
 *
 * Purpose: Sudden traffic surge (spike) and recovery
 * NFRs (enforced via thresholds in config.js):
 * - Error rate < 1%
 * - P95 response time under configured threshold
 */

export const options = {
  thresholds: getCommonThresholds(),
  scenarios: {
    users_spike_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: getSpikeTestConfig().stages,
      gracefulRampDown: '10s',
    },
  },
};

// Runs once per test (allowed to make HTTP requests)
export function setup() {
  return setupUserTest();
}

export default function (data) {
  executeUserTest(data);
}

export function handleSummary(data) {
  return createUserTestSummary(data, 'SPIKE');
}
