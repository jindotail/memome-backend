import { IUser, IUserSignUpDTO } from "../../../src/interfaces/IUser";
import * as db from "../../../src/models/firebase";
import UserModel from "../../../src/models/user";

describe("UserModel", () => {
  const userModel = new UserModel("test_user");

  const salt = "salt";
  const userSignUpDTO1: IUserSignUpDTO = {
    id: "id1",
    password: "password1",
    nickname: "nickname1",
    passwordQuestion: "passwordQuestion",
    passwordAnswer: "passwordAnswer",
  };
  const userSignUpDTO2: IUserSignUpDTO = {
    id: "id2",
    password: "password2",
    nickname: "nickname2",
    passwordQuestion: "passwordQuestion",
    passwordAnswer: "passwordAnswer",
  };

  afterEach(async () => {
    await db.deleteCollection("test_user");
  });

  test("update nickname", async () => {
    const newNickname = "newNickname";
    await userModel.create(userSignUpDTO1, salt);

    const userList: IUser[] = await userModel.findById(userSignUpDTO1.id);
    expect(userList[0].nickname).toEqual(userSignUpDTO1.nickname);
    expect(userList[0].password).toEqual(userSignUpDTO1.password);

    await userModel.update(userList[0].idx, { nickname: newNickname });

    const result: IUser[] = await userModel.findById(userSignUpDTO1.id);
    expect(result[0].nickname).toEqual(newNickname);
    expect(result[0].password).toEqual(userSignUpDTO1.password);
  });

  test("update password", async () => {
    const newPassword = "newPassword";
    await userModel.create(userSignUpDTO1, salt);

    const userList: IUser[] = await userModel.findById(userSignUpDTO1.id);
    expect(userList[0].nickname).toEqual(userSignUpDTO1.nickname);
    expect(userList[0].password).toEqual(userSignUpDTO1.password);

    await userModel.update(userList[0].idx, { password: newPassword });

    const result: IUser[] = await userModel.findById(userSignUpDTO1.id);
    expect(result[0].nickname).toEqual(userSignUpDTO1.nickname);
    expect(result[0].password).toEqual(newPassword);
  });

  test("update nickname and password", async () => {
    const newNickname = "newNickname";
    const newPassword = "newPassword";
    await userModel.create(userSignUpDTO1, salt);

    const userList: IUser[] = await userModel.findById(userSignUpDTO1.id);
    expect(userList[0].nickname).toEqual(userSignUpDTO1.nickname);
    expect(userList[0].password).toEqual(userSignUpDTO1.password);

    await userModel.update(userList[0].idx, {
      nickname: newNickname,
      password: newPassword,
    });

    const result: IUser[] = await userModel.findById(userSignUpDTO1.id);
    expect(result[0].nickname).toEqual(newNickname);
    expect(result[0].password).toEqual(newPassword);
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
        passwordQuestion: "passwordQuestion",
        passwordAnswer: "passwordAnswer",
      });
    }
    return list;
  };
});
