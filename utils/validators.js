/**
 * Simple validators for request values
 */
export function isPositiveInteger(v) {
  const num = Number(v);
  return Number.isInteger(num) && num > 0;
}

export function sanitizeInt(v, fallback = 0) {
  const num = Number(v);
  return Number.isInteger(num) ? num : fallback;
}
