import { auth } from './firebase';
import logger from '@/lib/logger';

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
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  // SECURITY: Redact PII (email, displayName, photoUrl) from error context before logging to prevent credential/identity leakage, and throw a sanitized error message rather than serializing raw metadata JSON.
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email ? '[REDACTED]' : null,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName ? '[REDACTED]' : null,
        email: provider.email ? '[REDACTED]' : null,
        photoUrl: provider.photoURL ? '[REDACTED]' : null,
      })) || [],
    },
    operationType,
    path,
  };

  logger.error({ err: errInfo }, 'Firestore operation failed');
  throw new Error(error instanceof Error ? error.message : String(error));
}
