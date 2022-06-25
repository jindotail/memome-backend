import { ResultSetHeader } from "mysql2";
import { IUser, IUserSignUpDTO } from "../interfaces/IUser";

export default class UserModel {
  idx = 1;
  userList: IUser[] = [
    {
      idx: this.idx++,
      id: "jindo",
      password: "1234",
      nickname: "진도",
      iso_time: new Date().toISOString(),
      created_at: new Date(),
    },
    {
      idx: this.idx++,
      id: "tail",
      password: "1234",
      nickname: "Tail",
      iso_time: new Date().toISOString(),
      created_at: new Date(),
    },
  ];

  public async create(userSignUpDTO: IUserSignUpDTO): Promise<ResultSetHeader> {
    console.log(
      `[MockUserModel] create id: ${userSignUpDTO.id} nickname: ${userSignUpDTO.nickname}`
    );

    this.userList.push({
      idx: this.idx++,
      id: userSignUpDTO.id,
      password: userSignUpDTO.password,
      nickname: userSignUpDTO.nickname,
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
}
