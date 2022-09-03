import { HttpStatusCode } from "@/common/http";
import { makeIdx } from "@/common/random";
import APIError from "@/errors/APIError";
import { IUser, IUserSignUpDTO } from "../interfaces/IUser";

export default class UserModel {
  userMap: Map<string, any> = new Map<string, any>([
    [
      makeIdx(21),
      {
        id: "jindo",
        password:
          "$argon2i$v=19$m=4096,t=3,p=1$B4jXISk08Tzy7A$aezhxwLzrBatQGS7D4GWhTF/S+k4A7nKaPsIJ/jeiZg",
        nickname: "진도",
        salt: "salt",
        iso_time: new Date().toISOString(),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ],
    [
      makeIdx(21),
      {
        id: "tail",
        password:
          "$argon2i$v=19$m=4096,t=3,p=1$B4jXISk08Tzy7A$aezhxwLzrBatQGS7D4GWhTF/S+k4A7nKaPsIJ/jeiZg",
        nickname: "Tail",
        salt: "salt",
        iso_time: new Date().toISOString(),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ],
    [
      makeIdx(21),
      {
        id: "aa",
        password:
          "$argon2i$v=19$m=4096,t=3,p=1$B4jXISk08Tzy7A$aezhxwLzrBatQGS7D4GWhTF/S+k4A7nKaPsIJ/jeiZg",
        nickname: "aa",
        salt: "salt",
        iso_time: new Date().toISOString(),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ],
    [
      makeIdx(21),
      {
        id: "bb",
        password:
          "$argon2i$v=19$m=4096,t=3,p=1$B4jXISk08Tzy7A$aezhxwLzrBatQGS7D4GWhTF/S+k4A7nKaPsIJ/jeiZg",
        nickname: "bb",
        salt: "salt",
        iso_time: new Date().toISOString(),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ],
    [
      makeIdx(21),
      {
        id: "cc",
        password:
          "$argon2i$v=19$m=4096,t=3,p=1$B4jXISk08Tzy7A$aezhxwLzrBatQGS7D4GWhTF/S+k4A7nKaPsIJ/jeiZg",
        nickname: "cc",
        salt: "salt",
        iso_time: new Date().toISOString(),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ],
  ]);

  public create(userSignUpDTO: IUserSignUpDTO, slat: string): void {
    console.log(
      `[MockUserModel] create id: ${userSignUpDTO.id} nickname: ${userSignUpDTO.nickname}`
    );

    this.userMap.set(makeIdx(21), {
      id: userSignUpDTO.id,
      password: userSignUpDTO.password,
      nickname: userSignUpDTO.nickname,
      salt: slat,
      iso_time: new Date().toISOString(),
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  public find(idx: string): IUser {
    return this.userMap.get(idx);
  }

  public findById(id: string): IUser[] {
    const result: IUser[] = [];
    for (const key of this.userMap.keys()) {
      const user = this.userMap.get(key);
      if (user.id !== id) continue;
      result.push({ idx: key, ...user });
    }
    return result;
  }

  private shuffleList(list: IUser[]) {
    return list.sort(() => Math.random() - 0.5);
  }

  public findRandomUser(count: number): IUser[] {
    const userList: IUser[] = [];
    for (const key of this.userMap.keys()) {
      const user = this.userMap.get(key);
      userList.push({ idx: key, ...user });
    }

    const shuffledList = this.shuffleList(userList);
    return shuffledList.slice(-count);
  }

  public delete(idx: string): void {
    this.userMap.delete(idx);
  }
}
