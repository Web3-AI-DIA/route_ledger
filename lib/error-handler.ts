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
  userId: string | undefined;
}

/**
 * Handles Firestore errors by redacting PII, logging the structured error,
 * and throwing a generic error message to prevent sensitive data leakage.
 */
export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
  userId?: string
) {
  const errorMessage = error instanceof Error ? error.message : String(error);

  // Create structured error info for internal logging
  const errInfo: FirestoreErrorInfo = {
    error: errorMessage,
    operationType,
    path,
    userId: userId || 'anonymous',
  };

  // Log the sanitized error metadata using the centralized logger
  logger.error({ err: error, metadata: errInfo }, 'Firestore Operation Failed');

  // Throw a generic error message to prevent PII or schema leakage to the client
  throw new Error('An error occurred while processing the request.');
}
