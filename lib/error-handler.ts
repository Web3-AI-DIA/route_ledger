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
    providerInfo?: {
      providerId: string;
      displayName?: string | null;
      email?: string | null;
      photoUrl?: string | null;
    }[];
  }
}

/**
 * Handles Firestore errors by logging sanitized metadata and throwing a safe error message.
 * Prevents PII leakage to the client-side UI and logs.
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      // PII (email, displayName, photoUrl) is stripped to prevent leakage
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        // PII (displayName, email, photoUrl) is stripped here as well
      })) || []
    },
    operationType,
    path
  }

  // Log sanitized error info to our structured logger
  logger.error({ errInfo }, 'Firestore Error');

  // Throw a generic error message to prevent leaking system/auth details to the UI
  throw new Error('An error occurred while processing the request.');
}
