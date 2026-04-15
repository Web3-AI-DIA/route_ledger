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
    email?: string | null;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo?: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

/**
 * Standardized Firestore error handler that prevents PII leakage and provides structured logging.
 * In the browser, it sanitizes PII (email, providerInfo) before logging.
 * It always throws a generic message to prevent leaking internal database structure to the UI.
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const isServer = typeof window === 'undefined';

  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: isServer ? auth.currentUser?.email : undefined,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: isServer ? auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) : undefined
    },
    operationType,
    path
  }

  // Use structured logger for better Sentry integration and avoid leaking to client console if possible
  logger.error({ err: error, context: errInfo }, 'Firestore operation failed');

  // Throw a generic message to prevent information exposure in the UI
  throw new Error('An error occurred while processing the request.');
}
