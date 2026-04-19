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
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName?: string | null;
      email?: string | null;
      photoUrl?: string | null;
    }[];
  }
}

/**
 * Handles Firestore errors by logging them securely and throwing a sanitized error message.
 * Prevents PII (Personally Identifiable Information) from leaking to the client-side UI
 * and ensures structured logging for better observability.
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  // Sanitize PII before logging/throwing
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      // Strip PII in the error object that might be logged or sent to external services
      email: undefined,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: undefined,
        email: undefined,
        photoUrl: undefined
      })) || []
    },
    operationType,
    path
  }

  // Use structured logging with error object
  logger.error({ err: error, ...errInfo }, 'Firestore operation failed');

  // Throw a standardized generic message to the UI to avoid leaking stack traces or PII
  throw new Error('An error occurred while processing the request.');
}
