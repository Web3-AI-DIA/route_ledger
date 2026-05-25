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
 * Handles Firestore errors by logging redacted information and throwing a safe error message.
 * Redacts PII like email, displayName, and photoUrl from logs.
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email ? '[REDACTED]' : (auth.currentUser?.email === null ? null : undefined),
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName ? '[REDACTED]' : (provider.displayName === null ? null : null),
        email: provider.email ? '[REDACTED]' : (provider.email === null ? null : null),
        photoUrl: provider.photoURL ? '[REDACTED]' : (provider.photoURL === null ? null : null)
      })) || []
    },
    operationType,
    path
  }

  // Use structured logger for better security and observability
  logger.error({ errInfo }, 'Firestore Error');

  // Throw a generic message to prevent leaking internal details or PII to the client
  throw new Error('An error occurred while processing the request.');
}
