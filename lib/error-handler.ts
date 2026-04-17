import { auth } from './firebase';

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
    providerInfo?: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

/**
 * Handles Firestore errors by logging them securely and throwing a sanitized error message.
 * Sanitizes PII (email, providerInfo) in browser environments to prevent accidental leakage.
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const isBrowser = typeof window !== 'undefined';

  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      // Sanitize PII in the browser console
      email: isBrowser ? undefined : auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      // Sanitize PII in the browser console
      providerInfo: isBrowser ? undefined : auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      }))
    },
    operationType,
    path
  };

  // Log structured error for developers (sanitized if in browser)
  console.error('Firestore Error:', JSON.stringify(errInfo));

  // Throw a generic error message to prevent leaking internal database/auth details to the UI
  throw new Error('An error occurred while processing the request.');
}
