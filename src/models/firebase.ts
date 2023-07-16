import { cert, initializeApp } from "firebase-admin/app";
import {
  FieldPath,
  FieldValue,
  Timestamp,
  WhereFilterOp,
  getFirestore,
} from "firebase-admin/firestore";
import config from "../config";

initializeApp({
  credential: cert({
    projectId: config.projectId,
    privateKey: config.privateKey,
    clientEmail: config.clientEmail,
  }),
});

const db = getFirestore();

export const saveDocument = async (collection: string, data: any) => {
  await db.collection(collection).add({
    ...data,
    created_at: FieldValue.serverTimestamp(),
    updated_at: FieldValue.serverTimestamp(),
  });
};

export const saveDocumentWithId = async (
  collection: string,
  id: string,
  data: any
) => {
  await db
    .collection(collection)
    .doc(id)
    .set({
      ...data,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    });
};

export const updateDocument = async (
  collection: string,
  id: string,
  data: any
) => {
  await db
    .collection(collection)
    .doc(id)
    .update({
      ...data,
      updated_at: FieldValue.serverTimestamp(),
    });
};

export const findCollection = async (
  collection: string
): Promise<{ id: string; data: any }[]> => {
  const snapshot = await db.collection(collection).get();

  const res = [];
  snapshot.forEach((doc) => {
    res.push({
      id: doc.id,
      data: doc.data(),
    });
  });
  return res;
};

export const isoToTimestamp = (
  iso: string
): { seconds: number; nanoseconds: number } => {
  // 날짜를 파싱하여 Date 객체 생성
  const date = new Date(iso);

  // Unix epoch (1970년 1월 1일 00:00:00 UTC)와의 차이를 계산
  const unixEpoch = new Date("1970-01-01T00:00:00Z");
  const diffInMilliseconds = date.getTime() - unixEpoch.getTime();

  // seconds와 nanoseconds 계산
  const seconds = Math.floor(diffInMilliseconds / 1000);
  const nanoseconds = (diffInMilliseconds % 1000) * 1e6;

  return { seconds, nanoseconds };
};

export const findCollectionWithCursor = async (
  collection: string,
  condition: {
    fieldPath: string | FieldPath;
    opStr: WhereFilterOp;
    value: any;
  },
  orderBy: string,
  limit: number,
  timestamp: Timestamp
): Promise<{ id: string; data: any }[]> => {
  const snapshot = await db
    .collection(collection)
    .where(condition.fieldPath, condition.opStr, condition.value)
    .orderBy(orderBy)
    .startAfter(timestamp)
    .limit(limit)
    .get();

  const res: any[] = [];
  snapshot.forEach((doc) => {
    res.push({
      id: doc.id,
      data: doc.data(),
    });
  });
  return res;
};

export const findCollectionWithCondition = async (
  collection: string,
  condition: { fieldPath: string | FieldPath; opStr: WhereFilterOp; value: any }
): Promise<{ id: string; data: any }[]> => {
  const snapshot = await db
    .collection(collection)
    .where(condition.fieldPath, condition.opStr, condition.value)
    .get();

  const res: any[] = [];
  snapshot.forEach((doc) => {
    res.push({
      id: doc.id,
      data: doc.data(),
    });
  });
  return res;
};

export const findDocument = async (
  collection: string,
  id: string
): Promise<any> => {
  const doc = await db.collection(collection).doc(id).get();
  return doc.data();
};

export const deleteDocument = async (
  collection: string,
  id: string
): Promise<void> => {
  await db.collection(collection).doc(id).delete();
};

export const deleteCollection = async (
  collection: string,
  batchSize: number = 1000
): Promise<void> => {
  const query = db.collection(collection).orderBy("__name__").limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
};

async function deleteQueryBatch(db: any, query: any, resolve: any) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    resolve();
    return;
  }

  const batch = db.batch();
  snapshot.docs.forEach((doc: any) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  process.nextTick(() => {
    deleteQueryBatch(db, query, resolve);
  });
}
