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
    emailVerified?: boolean;
    isAnonymous?: boolean;
    tenantId?: string | null;
    providerInfo?: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

/**
 * Handles Firestore errors by logging them and throwing a sanitized error message.
 * Prevents PII leakage to the client-side UI.
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
  };

  // Log structured error
  if (isServer) {
    logger.error({ errInfo }, 'Firestore Error');
  } else {
    // In browser, ensure PII is stripped from logs even if someone opens console
    logger.error({
      ...errInfo,
      authInfo: { ...errInfo.authInfo, email: undefined, providerInfo: undefined }
    }, 'Firestore Error');
  }

  // Always throw generic message to prevent PII leakage to UI
  throw new Error('An error occurred while processing the request.');
}
