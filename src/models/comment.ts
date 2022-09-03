import { IComment } from "@/interfaces/IComment";
import {
  deleteDocument,
  findCollectionWithCondition,
  findDocument,
  saveDocument,
} from "./firebase";

export default class CommentModel {
  constructor(private collection: string) {}

  public async create(userIdx: string, comment: string): Promise<void> {
    await saveDocument(this.collection, {
      user_idx: userIdx,
      comment,
      iso_time: new Date().toISOString(),
    });
  }

  public async findByUserIdx(userIdx: string): Promise<IComment[]> {
    const res = await findCollectionWithCondition(this.collection, {
      fieldPath: "user_idx",
      opStr: "==",
      value: userIdx,
    });
    return res.map((e) => {
      return { idx: e.id, ...e.data };
    });
  }

  public async find(idx: string): Promise<IComment> {
    return { idx, ...(await findDocument(this.collection, idx)) };
  }

  public async delete(idx: string): Promise<void> {
    await deleteDocument(this.collection, idx);
  }
}
