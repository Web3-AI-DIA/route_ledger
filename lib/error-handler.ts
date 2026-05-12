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
    providerInfo: {
      providerId: string;
      displayName?: string | null; // Optional to support redaction
      email?: string | null;       // Optional to support redaction
      photoUrl?: string | null;    // Optional to support redaction
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      // Redact PII to prevent leakage in logs
      email: auth.currentUser?.email ? '[REDACTED]' : null,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        // Redact PII to prevent leakage in logs
        displayName: provider.displayName ? '[REDACTED]' : null,
        email: provider.email ? '[REDACTED]' : null,
        photoUrl: provider.photoURL ? '[REDACTED]' : null
      })) || []
    },
    operationType,
    path
  }

  // Use structured logger and avoid logging PII
  logger.error({ errInfo }, 'Firestore Error');

  // Throw a generic error to the client to avoid leaking internal state/PII
  throw new Error('An error occurred while processing the request.');
}
