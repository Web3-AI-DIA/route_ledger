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
  email: string;
  displayName: string;
  photoUrl: string;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null, userId?: string) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
    userId,
    email: '[REDACTED]',
    displayName: '[REDACTED]',
    photoUrl: '[REDACTED]'
  };

  // Log the error with metadata for internal tracking (PII is redacted)
  logger.error({ err: error, metadata: errInfo }, 'Firestore operation failed');

  // Throw a generic error to prevent leaking internal details/PII to the client
  throw new Error('An error occurred while processing the request.');
}
