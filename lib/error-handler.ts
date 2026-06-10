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
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

/**
 * Handles Firestore errors by logging sanitized information and throwing a generic error.
 * Prevents PII leakage to the client and provides structured logging.
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      // Redact PII before logging or exposing in any way
      email: auth.currentUser?.email ? '[REDACTED]' : null,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName ? '[REDACTED]' : null,
        email: provider.email ? '[REDACTED]' : null,
        photoUrl: provider.photoURL ? '[REDACTED]' : null
      })) || []
    },
    operationType,
    path
  };

  // Use centralized logger with structured data
  logger.error({ err: error, firestore: errInfo }, 'Firestore Error');

  // Throw a generic error to the client to avoid leaking internal state or PII
  throw new Error('An error occurred while processing the request.');
}
