import mysql from "mysql";
import { IUserSignUpDTO } from "../interfaces/IUser";
import * as db from "./mysql";

export default class UserModel {
  public async create(userSignUpDTO: IUserSignUpDTO) {
    const insertQuery = "INSERT INTO user (??, ??, ??, ??) VALUES (?, ?, ?, ?)";
    const sql = mysql.format(insertQuery, [
      "id",
      "password",
      "nickname",
      "iso_time",
      userSignUpDTO.id,
      userSignUpDTO.password,
      userSignUpDTO.nickname,
      new Date().toISOString()
    ]);
    const res = await db.query(sql);
    return res;
  }

  public async findById(id: string) {
    const insertQuery = "SELECT * FROM user WHERE id = ?";
    const sql = mysql.format(insertQuery, [id]);
    const res = await db.query(sql);
    return res;
  }
}
