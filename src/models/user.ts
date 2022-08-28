import { shuffle } from "@/common/random";
import { IUser, IUserSignUpDTO } from "../interfaces/IUser";
import {
  deleteDocument,
  findCollection,
  findCollectionWithCondition,
  saveDocument,
} from "./firebase";

export default class UserModel {
  COLLECTION = "user";

  public async create(
    userSignUpDTO: IUserSignUpDTO,
    slat: string
  ): Promise<void> {
    saveDocument(this.COLLECTION, {
      id: userSignUpDTO.id,
      password: userSignUpDTO.password,
      nickname: userSignUpDTO.nickname,
      iso_time: new Date().toISOString(),
      salt: slat,
    });
  }

  public async findById(id: string): Promise<IUser[]> {
    const res = await findCollectionWithCondition(this.COLLECTION, {
      fieldPath: "id",
      opStr: "==",
      value: id,
    });

    return res.map((e) => {
      return { idx: e.id, ...e.data };
    });
  }

  public async findRandomUser(count: number): Promise<IUser[]> {
    const users = await findCollection(this.COLLECTION);

    shuffle(users);

    return users.slice(0, count).map((e) => {
      return { idx: e.id, ...e.data };
    });
  }

  public async delete(id: string): Promise<void> {
    deleteDocument(this.COLLECTION, id);
  }
}
