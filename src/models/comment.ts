import { IComment, ICommentResponse } from "@/interfaces/IComment";
import mysql from "mysql";
import { Service } from "typedi";
import * as db from "./mysql";

@Service()
export default class CommentModel {
  public async create(userIdx: number, comment: string) {
    const insertQuery = "INSERT INTO comment (??,??) VALUES (?,?)";
    const sql = mysql.format(insertQuery, [
      "user_idx",
      "comment",
      userIdx,
      comment,
    ]);
    const res = await db.query(sql);
    return res;
  }

  public async find(userIdx: number): Promise<ICommentResponse[]> {
    const insertQuery = "SELECT * FROM comment WHERE ?? = ?";
    const sql = mysql.format(insertQuery, ["user_idx", userIdx]);
    const res = (await db.query(sql)) as IComment[];

    return res.map((comment) => {
      return {
        comment: comment.comment,
        created_at: comment.created_at,
      } as ICommentResponse;
    });
  }
}
