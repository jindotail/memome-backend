import mysql from "mysql";
import { ResultSetHeader } from "mysql2";
import { IUser, IUserSignUpDTO } from "../interfaces/IUser";
import * as db from "./mysql";

export default class UserModel {
  public async create(
    userSignUpDTO: IUserSignUpDTO,
    slat: string
  ): Promise<ResultSetHeader> {
    const insertQuery =
      "INSERT INTO user (??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?)";
    const sql = mysql.format(insertQuery, [
      "id",
      "password",
      "nickname",
      "salt",
      "iso_time",
      userSignUpDTO.id,
      userSignUpDTO.password,
      userSignUpDTO.nickname,
      slat,
      new Date().toISOString(),
    ]);
    const res = await db.query(sql);
    return res as ResultSetHeader;
  }

  public async findById(id: string): Promise<IUser[]> {
    const insertQuery = "SELECT * FROM user WHERE id = ?";
    const sql = mysql.format(insertQuery, [id]);
    const res = (await db.query(sql)) as IUser[];
    return res;
  }

  private findRandomUserSql(count: number): string {
    const findQuery = "SELECT * FROM user ORDER BY rand() limit ?";
    return mysql.format(findQuery, [count]);
  }

  public async findRandomUser(count: number): Promise<IUser[]> {
    const sql = this.findRandomUserSql(count);
    const res = (await db.query(sql)) as IUser[];
    return res;
  }

  private disableSql(id: string): string {
    const insertQuery = "UPDATE user SET is_disabled = 1 WHERE ?? = ?";
    return mysql.format(insertQuery, ["id", id]);
  }

  public async disable(id: string): Promise<ResultSetHeader> {
    const sql = this.disableSql(id);
    const res = (await db.query(sql)) as ResultSetHeader;
    return res;
  }
}
