import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY_B64
  ? Buffer.from(process.env.FIREBASE_ADMIN_PRIVATE_KEY_B64, "base64").toString("utf8")
  : undefined;

const adminApp = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey,
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });

export const adminDb = getFirestore(adminApp);
export const adminStorage = getStorage(adminApp);