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

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      // SECURITY: Redact sensitive user PII to prevent exposure in application logs.
      email: auth.currentUser?.email ? '[REDACTED]' : auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName ? '[REDACTED]' : provider.displayName,
        email: provider.email ? '[REDACTED]' : provider.email,
        photoUrl: provider.photoURL ? '[REDACTED]' : provider.photoURL
      })) || []
    },
    operationType,
    path
  };

  // SECURITY: Use centralized logger to log sanitized error metadata instead of console.error.
  logger.error({ err: error, metadata: errInfo }, 'Firestore operation failed');

  // SECURITY: Throw a generic error message to the client to prevent exposing internal metadata or database details.
  throw new Error('An internal database error occurred');
}
