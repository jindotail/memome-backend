import mysql from "mysql";
import OkPacket from "mysql2/typings/mysql/lib/protocol/packets/OkPacket";
import { IComment } from "../../src/interfaces/IComment";
import { IUser } from "../../src/interfaces/IUser";
import * as db from "./mysql";

export const user = async (id: string): Promise<IUser> => {
  const password = "password";
  const nickname = "nickname";
  const insertQuery = "INSERT INTO user (??, ??, ??) VALUES (?, ?, ?)";
  const sql = mysql.format(insertQuery, [
    "id",
    "password",
    "nickname",
    id,
    password,
    nickname,
  ]);

  const result = (await db.query(sql)) as OkPacket;
  return {
    _idx: result.insertId,
    id: id,
    password: password,
    nickname: nickname,
    created_at: "time", // TODO - fix time
  };
};

export const comment = async (
  userIdx: number,
  content: string
): Promise<IComment> => {
  const insertQuery = "INSERT INTO comment (??,??) VALUES (?,?)";
  const sql = mysql.format(insertQuery, [
    "user_idx",
    "comment",
    userIdx,
    content,
  ]);

  const result = (await db.query(sql)) as OkPacket;
  return {
    _idx: result.insertId,
    user_idx: userIdx,
    comment: content,
    created_at: "time", // TODO - fix time
  };
};
