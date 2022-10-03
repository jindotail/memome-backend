import { shuffle } from "../common/random";
import { IUser, IUserSignUpDTO } from "../interfaces/IUser";
import {
  deleteDocument,
  findCollection,
  findCollectionWithCondition,
  findDocument,
  saveDocument
} from "./firebase";

export default class UserModel {
  constructor(private collection: string) {}

  public async create(
    userSignUpDTO: IUserSignUpDTO,
    slat: string
  ): Promise<void> {
    await saveDocument(this.collection, {
      id: userSignUpDTO.id,
      password: userSignUpDTO.password,
      nickname: userSignUpDTO.nickname,
      passwordQuestion: userSignUpDTO.passwordQuestion,
      passwordAnswer: userSignUpDTO.passwordAnswer,
      iso_time: new Date().toISOString(),
      salt: slat,
    });
  }

  public async find(idx: string): Promise<IUser> {
    return { idx, ...(await findDocument(this.collection, idx)) };
  }

  public async findById(id: string): Promise<IUser[]> {
    const res = await findCollectionWithCondition(this.collection, {
      fieldPath: "id",
      opStr: "==",
      value: id,
    });

    return res.map((e) => {
      return { idx: e.id, ...e.data };
    });
  }

  public async findRandomUser(count: number): Promise<IUser[]> {
    const users = await findCollection(this.collection);

    shuffle(users);

    return users.slice(0, count).map((e) => {
      return { idx: e.id, ...e.data };
    });
  }

  public async delete(idx: string): Promise<void> {
    await deleteDocument(this.collection, idx);
  }
}
