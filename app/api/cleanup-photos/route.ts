import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminStorage } from "@/lib/firebaseAdmin";

const EXPIRY_MS = 60 * 60 * 1000; // 1 hour

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cutoff = Date.now() - EXPIRY_MS;
  const photosRef = adminDb.collection("photos");
  const snapshot = await photosRef.get();

  const bucket = adminStorage.bucket();
  let deletedCount = 0;
  const errors: string[] = [];

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const uploadedAtMs = data.uploadedAt?.toMillis?.();

    if (!uploadedAtMs || uploadedAtMs > cutoff) {
      continue;
    }

    try {
      await bucket.file(data.storagePath).delete();
    } catch (error) {
      errors.push(`Storage delete failed for ${doc.id}: ${error}`);
    }

    try {
      await doc.ref.delete();
      deletedCount += 1;
    } catch (error) {
      errors.push(`Firestore delete failed for ${doc.id}: ${error}`);
    }
  }

  return NextResponse.json({
    deletedCount,
    checkedCount: snapshot.size,
    errors,
  });
}