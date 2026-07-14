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
  // SECURITY: Redact sensitive user PII before logging or throwing to prevent leakage
  const redactedEmail = auth.currentUser?.email ? '[REDACTED]' : null;

  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: redactedEmail,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName ? '[REDACTED]' : null,
        email: provider.email ? '[REDACTED]' : null,
        photoUrl: provider.photoURL ? '[REDACTED]' : null
      })) || []
    },
    operationType,
    path
  }

  // SECURITY: Use centralized structured logger for secure and consistent log management
  logger.error({ err: errInfo }, 'Firestore operation failed');

  // SECURITY: Throw generic error message to client to avoid leaking internal system metadata
  throw new Error('An internal database error occurred');
}
