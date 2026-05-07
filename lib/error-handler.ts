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

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }

  // Sanitize PII before logging to prevent leakage
  const sanitizedErrInfo = {
    ...errInfo,
    authInfo: {
      ...errInfo.authInfo,
      email: errInfo.authInfo.email ? '[REDACTED]' : null,
      providerInfo: errInfo.authInfo.providerInfo.map(p => ({
        ...p,
        displayName: p.displayName ? '[REDACTED]' : null,
        email: p.email ? '[REDACTED]' : null,
        photoUrl: p.photoUrl ? '[REDACTED]' : null,
      }))
    }
  };

  // Log sanitized error metadata
  logger.error({ err: error, info: sanitizedErrInfo }, 'Firestore Error');

  // Throw a generic error message to prevent leaking internal details or PII to the client UI
  throw new Error('An error occurred while processing the request.');
}
