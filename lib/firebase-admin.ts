import * as admin from 'firebase-admin';
import logger from './logger';

if (!admin.apps.length) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (projectId && clientEmail && privateKey && !privateKey.includes('dummy')) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      logger.info('Firebase admin initialized successfully');
    } else {
      admin.initializeApp({
        projectId: projectId || 'dummy-project'
      });
      logger.info('Firebase admin initialized with dummy project ID for build');
    }
  } catch (error) {
    logger.error({ err: error }, 'Firebase admin initialization error');
    if (!admin.apps.length) {
      admin.initializeApp({ projectId: 'dummy-project' });
    }
  }
}

export const adminDb = admin.firestore();
