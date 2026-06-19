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
  authInfo: {
    userId: string | undefined;
    email: string;
    displayName: string;
    photoUrl: string;
  }
}

/**
 * Handles Firestore errors by logging them securely and throwing a generic error.
 * Redacts PII to prevent leakage in logs and client responses.
 */
export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
  userId?: string
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
    authInfo: {
      userId,
      email: '[REDACTED]',
      displayName: '[REDACTED]',
      photoUrl: '[REDACTED]'
    }
  };

  // Use centralized logger instead of console.error
  logger.error({ err: error, metadata: errInfo }, 'Firestore operation failed');

  // Throw a generic error message to prevent leaking internal details or PII to the UI
  throw new Error('An error occurred while processing the request.');
}
