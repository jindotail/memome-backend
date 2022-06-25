import mysql from "mysql";
import { ResultSetHeader } from "mysql2";
import { IUserSignUpDTO } from "../interfaces/IUser";
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

  public async findById(id: string) {
    const insertQuery = "SELECT * FROM user WHERE id = ?";
    const sql = mysql.format(insertQuery, [id]);
    const res = await db.query(sql);
    return res;
  }
}
