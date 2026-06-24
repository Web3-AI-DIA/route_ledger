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
  }
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
  userId?: string
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId,
    },
    operationType,
    path
  };

  // Log the sanitized error information using the centralized logger
  logger.error({ err: error, metadata: errInfo }, 'Firestore operation failed');

  // Throw a generic error message to the client to prevent PII leakage and internal state exposure
  throw new Error('An error occurred while processing the request.');
}
