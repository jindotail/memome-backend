import { IComment } from "@/interfaces/IComment";
import mysql from "mysql";
import * as db from "./mysql";

export default class CommentModel {
  private createSql(userIdx: number, comment: string): string {
    const insertQuery = "INSERT INTO comment (??, ??, ??) VALUES (?, ?, ?)";
    return mysql.format(insertQuery, [
      "user_idx",
      "comment",
      "iso_time",
      userIdx,
      comment,
      new Date().toISOString(),
    ]);
  }

  public async create(userIdx: number, comment: string) {
    const sql = this.createSql(userIdx, comment);
    const res = await db.query(sql);
    return res; // TODO - 생성 시 return 값 어떻게 보낼지 정하기
  }

  private findSql(userIdx: number): string {
    const insertQuery =
      "SELECT idx, user_idx, comment, iso_time FROM comment WHERE ?? = ?";
    return mysql.format(insertQuery, ["user_idx", userIdx]);
  }

  public async find(userIdx: number): Promise<IComment[]> {
    const sql = this.findSql(userIdx);
    const res = (await db.query(sql)) as IComment[];
    return res;
  }
}
