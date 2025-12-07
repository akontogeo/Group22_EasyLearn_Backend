/**
 * Example tests to verify CI/CD pipeline
 * These tests demonstrate passing and failing scenarios
 */

describe('Basic Math Tests (Should Pass)', () => {
  test('addition works correctly', () => {
    expect(1 + 1).toBe(2);
  });

  test('subtraction works correctly', () => {
    expect(5 - 3).toBe(2);
  });

  test('multiplication works correctly', () => {
    expect(3 * 4).toBe(12);
  });
});

describe('String Tests (Should Pass)', () => {
  test('string concatenation works', () => {
    expect('Hello' + ' ' + 'World').toBe('Hello World');
  });

  test('string length is correct', () => {
    expect('test'.length).toBe(4);
  });
});

// UNCOMMENT THIS TO TEST CI/CD FAILURE
describe('Intentional Failure Test', () => {
  test('this test will fail', () => {
    expect(1 + 1).toBe(3); // Wrong expectation
  });
});
