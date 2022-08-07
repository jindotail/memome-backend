import { cert, initializeApp } from "firebase-admin/app";
import {
  FieldPath,
  FieldValue,
  getFirestore,
  WhereFilterOp,
} from "firebase-admin/firestore";
import serviceAccount from "../../serviceAccountKey.json";

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const saveDocument = async (collection: string, data: any) => {
  await db.collection(collection).add({
    ...data,
    created_at: FieldValue.serverTimestamp(),
    updated_at: FieldValue.serverTimestamp(),
  });
};

const saveDocumentWithId = async (
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

const updateDocument = async (collection: string, id: string, data: any) => {
  await db
    .collection(collection)
    .doc(id)
    .update({
      ...data,
      updated_at: FieldValue.serverTimestamp(),
    });
};

const findCollection = async (
  collection: string
): Promise<{ id: string; data: any }[]> => {
  const snapshot = await db.collection(collection).get();
  if (snapshot.empty) throw new Error();

  const res = [];
  snapshot.forEach((doc) => {
    res.push({
      id: doc.id,
      data: doc.data(),
    });
  });
  return res;
};

const findCollectionWithCondition = async (
  collection: string,
  condition: { fieldPath: string | FieldPath; opStr: WhereFilterOp; value: any }
): Promise<{ id: string; data: any }[]> => {
  const citiesRef = db.collection(collection);
  const snapshot = await citiesRef
    .where(condition.fieldPath, condition.opStr, condition.value)
    .get();
  if (snapshot.empty) throw new Error();

  const res = [];
  snapshot.forEach((doc) => {
    res.push({
      id: doc.id,
      data: doc.data(),
    });
  });
  return res;
};

const findDocument = async (collection: string, id: string): Promise<any> => {
  const doc = await db.collection(collection).doc(id).get();
  if (!doc.exists) throw new Error();
  return doc.data();
};
