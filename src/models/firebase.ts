import { cert, initializeApp } from "firebase-admin/app";
import {
  FieldPath,
  FieldValue,
  getFirestore,
  WhereFilterOp,
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

export const findCollectionWithCondition = async (
  collection: string,
  condition: { fieldPath: string | FieldPath; opStr: WhereFilterOp; value: any }
): Promise<{ id: string; data: any }[]> => {
  const citiesRef = db.collection(collection);
  const snapshot = await citiesRef
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
  const collectionRef = db.collection(collection);
  const query = collectionRef.orderBy("__name__").limit(batchSize);

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
