import { IComment } from "@/interfaces/IComment";
import { ResultSetHeader } from "mysql2";

export default class CommentModel {
  commentList: IComment[] = [];
  idx = 1;

  public async create(
    userIdx: number,
    comment: string
  ): Promise<ResultSetHeader> {
    console.log(
      `[MockCommentModel] create userIdx: ${userIdx} comment: ${comment}`
    );

    this.commentList.push({
      idx: this.idx++,
      user_idx: userIdx,
      comment: comment,
      iso_time: new Date().toISOString(),
      created_at: new Date(),
    });
    return {
      fieldCount: 0,
      affectedRows: 1,
      insertId: this.idx,
      info: "",
      serverStatus: 2,
      warningStatus: 0,
    } as ResultSetHeader;
  }

  public async find(userIdx: number): Promise<IComment[]> {
    console.log(`[MockCommentModel] find userIdx: ${userIdx}`);

    return this.commentList.filter((e) => e.user_idx == userIdx);
  }
}
