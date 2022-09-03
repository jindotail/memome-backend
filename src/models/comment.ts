import config from "@/config";
import { IComment } from "@/interfaces/IComment";
import {
  deleteDocument,
  findCollectionWithCondition,
  saveDocument,
} from "./firebase";

export default class CommentModel {
  COLLECTION = config.node_env == "test" ? "test_comment" : "comment";

  public async create(userIdx: string, comment: string): Promise<void> {
    await saveDocument(this.COLLECTION, {
      user_idx: userIdx,
      comment,
      iso_time: new Date().toISOString(),
    });
  }

  // TODO - user가 존재하는지 미리 확인
  public async findByUserIdx(userIdx: string): Promise<IComment[]> {
    const res = await findCollectionWithCondition(this.COLLECTION, {
      fieldPath: "user_idx",
      opStr: "==",
      value: userIdx,
    });
    return res.map((e) => {
      return { idx: e.id, ...e.data };
    });
  }

  public async delete(idx: string): Promise<void> {
    await deleteDocument(this.COLLECTION, idx);
  }
}
