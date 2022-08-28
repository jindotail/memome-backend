import { IComment } from "@/interfaces/IComment";
import {
  deleteDocument,
  findCollectionWithCondition,
  saveDocument,
} from "./firebase";

export default class CommentModel {
  COLLECTION = "comment";

  public async create(userIdx: string, comment: string): Promise<void> {
    saveDocument(this.COLLECTION, {
      user_idx: userIdx,
      comment,
      iso_time: new Date().toISOString(),
    });
  }

  public async find(userIdx: string): Promise<IComment[]> {
    const res = await findCollectionWithCondition(this.COLLECTION, {
      fieldPath: "user_idx",
      opStr: "==",
      value: userIdx,
    });
    return res.map((e) => {
      return { idx: e.id, ...e.data };
    });
  }

  public async disable(idx: string): Promise<void> {
    deleteDocument(this.COLLECTION, idx);
  }
}
