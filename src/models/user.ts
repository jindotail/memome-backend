import mysql from "mysql";
import { Service } from "typedi";
import * as db from "./mysql";

@Service()
export default class UserModel {
  public async create(nickname: string) {
    const insertQuery = "INSERT INTO user (??) VALUES (?)";
    const sql = mysql.format(insertQuery, ["nickname", nickname]);
    const res = await db.query(sql);
    return res;
  }

  public async find(userId: number) {
    const insertQuery = "SELECT * FROM user WHERE id = ?";
    const sql = mysql.format(insertQuery, [userId]);
    const res = await db.query(sql);
    return res;
  }
}
