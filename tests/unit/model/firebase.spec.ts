import { Timestamp } from "firebase-admin/firestore";
import * as db from "../../../src/models/firebase";

beforeAll(async () => {});

describe("Firebase", () => {
  const id1 = "id1";
  const id2 = "id2";
  const name1 = "name1";
  const name2 = "name2";

  beforeEach(async () => {});

  test("delete collection", async () => {
    const collection = "test delete collection";
    await db.saveDocument(collection, {});
    await db.saveDocument(collection, {});

    await db.deleteCollection(collection);

    const result = await db.findCollection(collection);

    expect(result.length).toEqual(0);
  });

  test("delete document", async () => {
    const collection = "test delete document";

    await db.saveDocumentWithId(collection, id1, { name: name1 });
    await db.saveDocumentWithId(collection, id2, { name: name2 });

    await db.deleteDocument(collection, id1);

    const result = await db.findCollection(collection);

    expect(result[0].id).toEqual(id2);
    expect(result[0].data.name).toEqual(name2);
    await db.deleteCollection(collection);
  });

  test("update document with id", async () => {
    const collection = "test update document";

    await db.saveDocumentWithId(collection, id1, { name: name1 });
    const result1 = await db.findDocument(collection, id1);
    expect(result1.name).toEqual(name1);

    await db.updateDocument(collection, id1, { name: name2 });
    const result2 = await db.findDocument(collection, id1);
    expect(result2.name).toEqual(name2);
    await db.deleteCollection(collection);
  });

  test("find collection", async () => {
    const collection = "test find collection";

    await db.saveDocumentWithId(collection, id1, { name: name1 });
    await db.saveDocumentWithId(collection, id2, { name: name2 });

    const result = await db.findCollection(collection);

    expect(result[0].id).toEqual(id1);
    expect(result[0].data.name).toEqual(name1);
    expect(result[1].id).toEqual(id2);
    expect(result[1].data.name).toEqual(name2);
    await db.deleteCollection(collection);
  });

  test("find collection with condition", async () => {
    const collection = "test find collection with condition";

    await db.saveDocumentWithId(collection, id1, { name: name1 });
    await db.saveDocumentWithId(collection, id2, { name: name2 });

    const result = await db.findCollectionWithCondition(collection, {
      fieldPath: "name",
      opStr: "==",
      value: name2,
    });

    expect(result[0].id).toEqual(id2);
    expect(result[0].data.name).toEqual(name2);
    await db.deleteCollection(collection);
  });

  test("find document", async () => {
    const collection = "test find document";

    await db.saveDocumentWithId(collection, id1, { name: name1 });

    const result = await db.findDocument(collection, id1);

    expect(result.name).toEqual(name1);
    await db.deleteCollection(collection);
  });

  test("isoToTimestamp", () => {
    const { seconds, nanoseconds } = db.isoToTimestamp(
      "2023-07-16T11:03:26.922Z"
    );

    expect(seconds).toEqual(1689505406);
    expect(nanoseconds).toEqual(922000000);
  });

  test("find collection with cursor", async () => {
    const col = "test find collection with cursor";

    await db.saveDocumentWithId(col, "D7rakZvFFgIkuFlHtojb", {
      user_idx: "user_idx",
      comment: "첫번째 댓글",
      iso_time: new Date().toISOString(),
    });
    await db.saveDocumentWithId(col, "YFoJvQ6l7fOUHLbeYJpd", {
      user_idx: "user_idx",
      comment: "두번째 댓글",
      iso_time: new Date().toISOString(),
    });
    await db.saveDocumentWithId(col, "VpdVIZHhlJRwdkUKVrg5", {
      user_idx: "user_idx",
      comment: "세번째 댓글",
      iso_time: new Date().toISOString(),
    });
    await db.saveDocumentWithId(col, "AiMrlDTmukHXdvoZN2o4", {
      user_idx: "user_idx",
      comment: "네번째 댓글",
      iso_time: new Date().toISOString(),
    });

    // 첫 번째 댓글 들고오기
    const firstComment = await db.findDocument(col, "D7rakZvFFgIkuFlHtojb");

    // 첫 번째 댓글 생성 시간 이후 댓글 2개를 가져온다.
    const result = await db.findCollectionWithCursor(
      col,
      {
        fieldPath: "user_idx",
        opStr: "==",
        value: "user_idx",
      },
      "created_at",
      2,
      new Timestamp(
        firstComment.updated_at._seconds,
        firstComment.updated_at._nanoseconds
      )
    );

    // 2개의 댓글을 들고와야 한다
    expect(result.length).toEqual(2);
    // 첫 번쨰 댓글 이후인 두 번째 댓글과 세 번째 댓글이 들고와야 한다
    expect(result[0].data.comment).toEqual("두번째 댓글");
    expect(result[1].data.comment).toEqual("세번째 댓글");

    await db.deleteCollection(col);
  });
});
