import logger from './logger';
import { auth } from './firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
    }[];
  }
}

/**
 * Handles Firestore errors by logging them securely and throwing a sanitized error message.
 * Prevents PII (like email, display name) from being logged or sent to the client.
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    authInfo: {
      userId: auth.currentUser?.uid,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
      })) || []
    },
    operationType,
    path
  };

  // Log the detailed error internally using structured logging
  // We pass the original error under 'err' key for proper serialization
  logger.error({ err: error, ...errInfo }, 'Firestore operation failed');

  // Throw a generic error message to avoid leaking internal details or PII to the UI
  throw new Error('An error occurred while processing the request.');
}
