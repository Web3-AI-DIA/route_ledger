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
  metadata: {
    email: string;
    displayName: string;
    photoUrl: string;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null, userId?: string) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
    userId,
    metadata: {
      email: '[REDACTED]',
      displayName: '[REDACTED]',
      photoUrl: '[REDACTED]',
    }
  };

  logger.error({ err: error, metadata: errInfo }, 'Firestore Error');
  throw new Error('An error occurred while processing the request.');
}
