import { auth } from './firebase';
import logger from './logger';

// SECURITY: Prevent PII leakage and internal metadata exposure by redacting sensitive user information and throwing a generic client error.

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

  // Log error structured under 'err' key for consistent structured logging
  logger.error({ err: error instanceof Error ? error : new Error(String(error)), errInfo }, 'Firestore Error occurred');

  throw new Error('An internal database error occurred');
}
