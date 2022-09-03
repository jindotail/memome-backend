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
    await db.updateDocument(collection, id1, { name: name2 });
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
});
