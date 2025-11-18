/**
 * No-op database connector. This project is configured to run with in-memory mock data only.
 * Keeping this function to avoid changing server bootstrap.
 */
export async function connectDatabase() {
  console.warn('Database disabled: running with in-memory mock data only.');
}

/**
 * Always returns false because there is no DB connection in the mock-only mode.
 */
export function isDbConnected() {
  return false;
}
