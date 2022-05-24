import mysql from "mysql";
import { Service } from "typedi";
import * as db from "./mysql";

@Service()
export default class CommentModel {
  public async create(userId: number, comment: string) {
    const insertQuery = "INSERT INTO comment (??,??) VALUES (?,?)";
    const sql = mysql.format(insertQuery, [
      "user_id",
      "comment",
      userId,
      comment,
    ]);
    const res = await db.query(sql);
    return res;
  }

  public async find(userId: number) {
    const insertQuery = "SELECT * FROM comment WHERE user_id = ?";
    const sql = mysql.format(insertQuery, [userId]);
    const res = await db.query(sql);
    return res;
  }
}
