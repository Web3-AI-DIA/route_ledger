import * as admin from 'firebase-admin';
import logger from './logger';

if (!admin.apps.length) {
  try {
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
      logger.info('Firebase admin initialized successfully');
    } else {
      logger.warn('Firebase admin credentials missing, skipping initialization');
    }
  } catch (error) {
    logger.error({ error }, 'Firebase admin initialization error');
  }
}

export const adminDb = admin.firestore();
