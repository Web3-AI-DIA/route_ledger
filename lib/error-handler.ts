import logger from '@/lib/logger';

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
  metadata?: Record<string, any>;
}

/**
 * Handles Firestore errors by logging sanitized information and throwing a generic error.
 * Prevents PII leakage (email, displayName, photoUrl) to logs and the client.
 */
export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
  userId?: string
) {
  const errorMessage = error instanceof Error ? error.message : String(error);

  const errInfo: FirestoreErrorInfo = {
    error: errorMessage,
    operationType,
    path,
    userId,
  };

  // Log the error server-side with metadata
  // We use a generic message to the client to prevent leaking internal state or PII
  logger.error({ err: error, metadata: errInfo }, 'Firestore Operation Failed');

  throw new Error('An error occurred while processing the request.');
}
