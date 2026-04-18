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
    email?: string | null | undefined;
    emailVerified?: boolean | undefined;
    isAnonymous?: boolean | undefined;
    tenantId?: string | null | undefined;
    providerInfo?: {
      providerId: string;
      displayName?: string | null;
      email?: string | null;
      photoUrl?: string | null;
    }[];
  }
}

/**
 * Handles Firestore errors by logging them securely and throwing a sanitized error.
 * PII such as email and display name are stripped before logging to prevent data leakage.
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      // PII Sanitization: Strip sensitive user data from logs
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        // Strip PII: displayName, email, photoURL
      })) || []
    },
    operationType,
    path
  };

  // Use structured logger for better searchability and Sentry integration
  logger.error({ err: errInfo }, 'Firestore Error');

  // Throw a generic error message to prevent leaking internals to the client-side UI
  throw new Error('An error occurred while processing the request.');
}
