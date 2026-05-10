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
    email?: string | null; // Optional to support redaction
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo?: {
      providerId: string;
    }[];
  }
}

/**
 * Handles Firestore errors by logging sanitized metadata and throwing a generic error.
 * Prevents PII leakage (email, display name, etc.) to logs and client-side UI.
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email ? '[REDACTED]' : undefined,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        // display name, email, and photo URL are redacted
      })) || []
    },
    operationType,
    path
  };

  // Use centralized logger for better security and observability
  logger.error({ errInfo }, 'Firestore operation failed');

  // Throw a generic message to prevent internal details from leaking to the UI
  throw new Error('An error occurred while processing the request.');
}
