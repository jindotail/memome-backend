import { HttpStatusCode } from "@/common/http";
import APIError from "@/errors/APIError";
import e from "express";
import { ResultSetHeader } from "mysql2";
import { IUser, IUserSignUpDTO } from "../interfaces/IUser";

export default class UserModel {
  idx = 1;
  userList: IUser[] = [
    {
      idx: this.idx++,
      id: "jindo",
      password:
        "$argon2i$v=19$m=4096,t=3,p=1$B4jXISk08Tzy7A$aezhxwLzrBatQGS7D4GWhTF/S+k4A7nKaPsIJ/jeiZg",
      nickname: "진도",
      salt: "salt",
      is_disabled: 0,
      iso_time: new Date().toISOString(),
      created_at: new Date(),
    },
    {
      idx: this.idx++,
      id: "tail",
      password:
        "$argon2i$v=19$m=4096,t=3,p=1$B4jXISk08Tzy7A$aezhxwLzrBatQGS7D4GWhTF/S+k4A7nKaPsIJ/jeiZg",
      nickname: "Tail",
      salt: "salt",
      is_disabled: 0,
      iso_time: new Date().toISOString(),
      created_at: new Date(),
    },
  ];

  private isIdExist(id: string): boolean {
    const result = this.userList.filter((user) => user.id === id);
    if (result.length > 0) return true;
    return false;
  }

  public async create(userSignUpDTO: IUserSignUpDTO): Promise<ResultSetHeader> {
    console.log(
      `[MockUserModel] create id: ${userSignUpDTO.id} nickname: ${userSignUpDTO.nickname}`
    );

    if (this.isIdExist(userSignUpDTO.id))
      throw new APIError(
        "MockUserModel",
        HttpStatusCode.BAD_REQUEST,
        "duplicate user id"
      );

    this.userList.push({
      idx: this.idx++,
      id: userSignUpDTO.id,
      password: userSignUpDTO.password,
      nickname: userSignUpDTO.nickname,
      salt: "salt",
      is_disabled: 0,
      iso_time: new Date().toISOString(),
      created_at: new Date(),
    });
    return {
      fieldCount: 0,
      affectedRows: 1,
      insertId: this.idx,
      info: "",
      serverStatus: 2,
      warningStatus: 0,
    } as ResultSetHeader;
  }

  public async findById(id: string) {
    console.log(`[MockUserModel] findById id: ${id}`);
    return this.userList.filter((e) => e.id == id);
  }

  public async disable(id: string): Promise<ResultSetHeader> {
    this.userList = this.userList.map((e) => {
      if (e.id == id)
        return {
          ...e,
          is_disabled: 1,
        };
      return e;
    });

    return {
      fieldCount: 0,
      affectedRows: 1,
      insertId: 0,
      info: "Rows matched: 1  Changed: 1  Warnings: 0",
      serverStatus: 16386,
      warningStatus: 0,
      stateChanges: {
        systemVariables: {
          character_set_results: "utf8",
          character_set_connection: "utf8",
          character_set_client: "utf8",
        },
        schema: null,
        trackStateChange: null,
      },
      changedRows: 1,
    } as ResultSetHeader;
  }
}
