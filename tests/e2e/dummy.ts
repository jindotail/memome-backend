import mysql from "mysql";
import OkPacket from "mysql2/typings/mysql/lib/protocol/packets/OkPacket";
import { IComment } from "../../src/interfaces/IComment";
import { IUser } from "../../src/interfaces/IUser";
import * as db from "./mysql";

const convertDateToDatetime = (date: Date): string => {
  return date.toISOString().replace("T", " ").replace("Z", "");
};

export const user = async (id: string, createdAt: Date): Promise<IUser> => {
  const password = "password";
  const nickname = "nickname";
  const insertQuery = "INSERT INTO user (??, ??, ??, ??) VALUES (?, ?, ?, ?)";
  const sql = mysql.format(insertQuery, [
    "id",
    "password",
    "nickname",
    "created_at",
    id,
    password,
    nickname,
    convertDateToDatetime(createdAt),
  ]);

  const result = (await db.query(sql)) as OkPacket;
  return {
    _idx: result.insertId,
    id: id,
    password: password,
    nickname: nickname,
    created_at: createdAt,
  };
};

export const comment = async (
  userIdx: number,
  content: string,
  createdAt: Date
): Promise<IComment> => {
  const insertQuery = "INSERT INTO comment (??,??,??) VALUES (?,?,?)";
  const sql = mysql.format(insertQuery, [
    "user_idx",
    "comment",
    "created_at",
    userIdx,
    content,
    convertDateToDatetime(createdAt),
  ]);

  const result = (await db.query(sql)) as OkPacket;
  return {
    _idx: result.insertId,
    user_idx: userIdx,
    comment: content,
    created_at: createdAt,
  };
};
