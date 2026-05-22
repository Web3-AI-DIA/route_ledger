import { auth } from './firebase';
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
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    // PII fields (email, displayName, photoUrl) are explicitly excluded for security
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  // Redact PII (Personally Identifiable Information) to prevent sensitive data leakage
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
    },
    operationType,
    path
  }

  // Use structured logger instead of console.error for better security and monitoring
  logger.error({ errInfo }, 'Firestore Error');

  // Throw a generic error message to prevent leaking internal details or PII to the client-side UI
  throw new Error('An error occurred while processing the request.');
}
