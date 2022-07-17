import mysql from "mysql";
import { ResultSetHeader } from "mysql2";
import * as db from "./mysql";

export default class TokenModel {
  private createSql(userIdx: number, refreshToken: string): string {
    const insertQuery =
      "INSERT INTO token (??, ??) VALUES (?, ?) ON DUPLICATE KEY UPDATE refresh_token = VALUES(refresh_token), created_at = now()";
    return mysql.format(insertQuery, [
      "user_idx",
      "refresh_token",
      userIdx,
      refreshToken,
      refreshToken,
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
    const findQuery = "SELECT refresh_token FROM token WHERE ?? = ?";
    return mysql.format(findQuery, ["user_idx", userIdx]);
  }

  // TODO - 공통적으로 string[]으로 넘기고 service에서 하나만 들고 오는게 나을듯
  public async find(userIdx: number): Promise<string> {
    const sql = this.findSql(userIdx);
    const res = await db.query(sql);
    return res[0];
  }

  private deleteSql(userIdx: number): string {
    const deleteQuery = "DELETE FROM token WHERE ?? = ?";
    return mysql.format(deleteQuery, ["user_idx", userIdx]);
  }

  public async delete(userIdx: number): Promise<ResultSetHeader> {
    const sql = this.deleteSql(userIdx);
    const res = (await db.query(sql)) as ResultSetHeader;
    return res;
  }
}
