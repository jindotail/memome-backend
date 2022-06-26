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
      is_disabled: 0,
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

    return this.commentList.filter(
      (e) => e.user_idx == userIdx && e.is_disabled == 0
    );
  }

  public async disable(idx: number): Promise<ResultSetHeader> {
    this.commentList = this.commentList.map((e) => {
      if (e.idx == idx)
        return {
          ...e,
          is_disabled: 1,
        };
      return e;
    });

    return {
      fieldCount: 0,
      affectedRows: 0,
      insertId: 0,
      info: "Rows matched: 0  Changed: 0  Warnings: 0",
      serverStatus: 16386,
      warningStatus: 0,
      stateChanges: {
        systemVariables: {
          character_set_results: "utf8",
          character_set_connection: "utf8",
          character_set_client: "utf8",
        },
        schema: null,
        trackStateChange: null,
      },
      changedRows: 0,
    } as ResultSetHeader;
  }
}
