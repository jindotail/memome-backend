import { IComment } from "@/interfaces/IComment";
import mysql from "mysql";
import { ResultSetHeader } from "mysql2";
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

  public async create(
    userIdx: number,
    comment: string
  ): Promise<ResultSetHeader> {
    const sql = this.createSql(userIdx, comment);
    const res = await db.query(sql);
    return res as ResultSetHeader;
  }

  private findSql(userIdx: number): string {
    const findQuery =
      "SELECT idx, user_idx, comment, iso_time FROM comment WHERE ?? = ? and is_disabled = 0";
    return mysql.format(findQuery, ["user_idx", userIdx]);
  }

  public async find(userIdx: number): Promise<IComment[]> {
    const sql = this.findSql(userIdx);
    const res = (await db.query(sql)) as IComment[];
    return res;
  }

  private disableSql(idx: number): string {
    const insertQuery = "UPDATE comment SET is_disabled = 1 WHERE ?? = ?";
    return mysql.format(insertQuery, ["idx", idx]);
  }

  public async disable(idx: number) {
    const sql = this.disableSql(idx);
    const res = await db.query(sql);
    return res;
  }
}
