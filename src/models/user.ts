import { shuffle } from "@/common/random";
import { IUser, IUserSignUpDTO } from "../interfaces/IUser";
import {
  deleteDocument,
  findCollection,
  findCollectionWithCondition,
  saveDocument,
  findDocument,
} from "./firebase";
import config from "@/config";

export default class UserModel {
  COLLECTION = config.node_env == "test" ? "test_user" : "user";

  // TODO - id가 중복인지 확인 필요
  public async create(
    userSignUpDTO: IUserSignUpDTO,
    slat: string
  ): Promise<void> {
    await saveDocument(this.COLLECTION, {
      id: userSignUpDTO.id,
      password: userSignUpDTO.password,
      nickname: userSignUpDTO.nickname,
      iso_time: new Date().toISOString(),
      salt: slat,
    });
  }

  public async find(idx: string): Promise<IUser> {
    return findDocument(this.COLLECTION, idx);
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

  public async delete(idx: string): Promise<void> {
    await deleteDocument(this.COLLECTION, idx);
  }
}
