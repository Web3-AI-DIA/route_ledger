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
 * Handles Firestore errors by logging sanitized metadata and throwing a safe error message.
 * This prevents PII (Personally Identifiable Information) from being logged or exposed to the UI.
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      // PII Redacted: Do not log user email
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        // PII Redacted: Do not log displayName, email, or photoUrl
      })) || []
    },
    operationType,
    path
  };

  // Use centralized logger instead of console.error
  logger.error({ err: error, ...errInfo }, 'Firestore operation failed');

  // Throw a generic error message to prevent leaking internal details or PII to the UI
  throw new Error('An error occurred while processing the request.');
}
