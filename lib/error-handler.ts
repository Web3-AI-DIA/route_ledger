import logger from './logger';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  userId?: string;
}

/**
 * Handles Firestore errors by logging sanitized metadata and throwing a generic error.
 * Prevents PII leakage and resolves circular dependencies with firebase.ts.
 */
export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
  userId?: string
) {
  const info: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
    userId,
  };

  // Structured logging with sanitized metadata
  logger.error({ err: error, metadata: info }, 'Firestore operation failed');

  // Throw a generic error to prevent leaking internal details or PII to the client-side UI
  throw new Error('An error occurred while processing the request.');
}
