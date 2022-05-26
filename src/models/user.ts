import mysql from "mysql";
import { Service } from "typedi";
import { IUserSignUpDTO } from "../interfaces/IUser";
import * as db from "./mysql";

@Service()
export default class UserModel {
  public async create(userSignUpDTO: IUserSignUpDTO) {
    const insertQuery = "INSERT INTO user (??, ??, ??) VALUES (?, ?, ?)";
    const sql = mysql.format(insertQuery, [
      "id",
      "password",
      "nickname",
      userSignUpDTO.id,
      userSignUpDTO.password,
      userSignUpDTO.nickname,
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