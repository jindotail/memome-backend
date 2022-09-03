import { IUser, IUserSignUpDTO } from "../../../src/interfaces/IUser";
import * as db from "../../../src/models/firebase";
import UserModel from "../../../src/models/user";

describe("UserModel", () => {
  const userModel = new UserModel();

  const salt = "salt";
  const userSignUpDTO1: IUserSignUpDTO = {
    id: "id1",
    password: "password1",
    nickname: "nickname1",
  };
  const userSignUpDTO2: IUserSignUpDTO = {
    id: "id2",
    password: "password2",
    nickname: "nickname2",
  };

  afterEach(async () => {
    await db.deleteCollection("test_user");
  });

  test("find", async () => {
    await userModel.create(userSignUpDTO1, salt);
    await userModel.create(userSignUpDTO2, salt);

    const userList: IUser[] = await userModel.findById(userSignUpDTO1.id);
    const result: IUser = await userModel.find(userList[0].idx);

    expect(userList[0].id).toEqual(result.id);
  });

  test("findById - 사용자가 존재하지 않는 경우", async () => {
    await userModel.create(userSignUpDTO1, salt);
    await userModel.create(userSignUpDTO2, salt);

    const userList: IUser[] = await userModel.findById("not existing id");

    expect(userList.length).toEqual(0);
  });

  test("findById - 사용자가 존재하는 경우", async () => {
    await userModel.create(userSignUpDTO1, salt);
    await userModel.create(userSignUpDTO2, salt);

    const userList: IUser[] = await userModel.findById(userSignUpDTO1.id);

    expect(userList.length).toEqual(1);
    expect(userList[0].idx).toBeDefined();
    expect(userList[0].iso_time).toBeDefined();
    expect(userList[0].created_at).toBeDefined();
    expect(userList[0].updated_at).toBeDefined();

    expect(userList[0].id).toEqual(userSignUpDTO1.id);
    expect(userList[0].password).toEqual(userSignUpDTO1.password);
    expect(userList[0].nickname).toEqual(userSignUpDTO1.nickname);
  });

  test("findRandomUser", async () => {
    const dummyUserList = getDummyUserList(6);
    await Promise.all(
      dummyUserList.map(async (user) => await userModel.create(user, salt))
    );

    const userList: IUser[] = await userModel.findRandomUser(5);

    expect(userList.length).toEqual(5);
  });

  test("delete", async () => {
    await userModel.create(userSignUpDTO1, salt);
    await userModel.create(userSignUpDTO2, salt);

    const userList: IUser[] = await userModel.findById(userSignUpDTO1.id);

    await userModel.delete(userList[0].idx);

    const result: IUser[] = await userModel.findById(userSignUpDTO1.id);

    expect(result.length).toEqual(0);
  });

  const getDummyUserList = (count: number): IUserSignUpDTO[] => {
    const list: IUserSignUpDTO[] = [];
    for (let i = 1; i <= count; i++) {
      list.push({
        id: "id" + i,
        password: "password" + i,
        nickname: "nickname" + i,
      });
    }
    return list;
  };
});
