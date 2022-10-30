import { IUser, IUserSignUpDTO } from "../../../src/interfaces/IUser";
import UserModel from "../../../src/models/mock_user";

describe("UserModel", () => {
  const userModel = new UserModel();

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

  beforeEach(async () => {
    userModel.userMap = new Map();
  });

  test("update", () => {
    const newNickname = "newNickname";
    userModel.create(userSignUpDTO1, salt);

    const userList: IUser[] = userModel.findById(userSignUpDTO1.id);
    expect(userList[0].nickname).toEqual(userSignUpDTO1.nickname);
    userModel.update(userList[0].idx, { nickname: newNickname });

    const result: IUser[] = userModel.findById(userSignUpDTO1.id);
    expect(result[0].nickname).toEqual(newNickname);
  });

  test("find", () => {
    userModel.create(userSignUpDTO1, salt);
    userModel.create(userSignUpDTO2, salt);

    const userList: IUser[] = userModel.findById(userSignUpDTO1.id);
    const result: IUser = userModel.find(userList[0].idx);

    expect(userList[0].id).toEqual(result.id);
  });

  test("findById - 사용자가 존재하지 않는 경우", () => {
    userModel.create(userSignUpDTO1, salt);
    userModel.create(userSignUpDTO2, salt);

    const userList: IUser[] = userModel.findById("not existing id");

    expect(userList.length).toEqual(0);
  });

  test("findById - 사용자가 존재하는 경우", () => {
    userModel.create(userSignUpDTO1, salt);
    userModel.create(userSignUpDTO2, salt);

    const userList: IUser[] = userModel.findById(userSignUpDTO1.id);

    expect(userList.length).toEqual(1);
    expect(userList[0].idx).toBeDefined();
    expect(userList[0].iso_time).toBeDefined();
    expect(userList[0].created_at).toBeDefined();
    expect(userList[0].updated_at).toBeDefined();

    expect(userList[0].id).toEqual(userSignUpDTO1.id);
    expect(userList[0].password).toEqual(userSignUpDTO1.password);
    expect(userList[0].nickname).toEqual(userSignUpDTO1.nickname);
  });

  test("findRandomUser", () => {
    const dummyUserList = getDummyUserList(6);
    dummyUserList.map((user) => userModel.create(user, salt));

    const userList: IUser[] = userModel.findRandomUser(5);

    expect(userList.length).toEqual(5);
  });

  test("delete", () => {
    userModel.create(userSignUpDTO1, salt);
    userModel.create(userSignUpDTO2, salt);

    const userList: IUser[] = userModel.findById(userSignUpDTO1.id);

    userModel.delete(userList[0].idx);

    const result: IUser[] = userModel.findById(userSignUpDTO1.id);

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
