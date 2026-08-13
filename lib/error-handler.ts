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
  // SECURITY: Redact sensitive fields (email, displayName, photoUrl) to prevent PII leakage in logs
  const redact = (val: string | null | undefined): string | null | undefined => {
    return val ? '[REDACTED]' : val;
  };

  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: redact(auth.currentUser?.email),
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: redact(provider.displayName),
        email: redact(provider.email),
        photoUrl: redact(provider.photoURL)
      })) || []
    },
    operationType,
    path
  };

  // SECURITY: Migrate from console.error to centralized Pino logger using standardized err key
  logger.error({ err: errInfo }, 'Firestore Error');

  // SECURITY: Throw a sanitized version of the error message to avoid exposing internal user metadata JSON,
  // while preserving the underlying database error message for callers to handle.
  throw new Error(error instanceof Error ? error.message : String(error));
}
