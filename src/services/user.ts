import { HttpStatusCode } from "../common/http";
import APIError from "../errors/APIError";
import { Inject, Service } from "typedi";
import { Logger } from "winston";
import UserModel from "../models/user";

@Service()
export default class UserService {
  constructor(
    @Inject("userModel") private UserModel: UserModel,
    @Inject("logger") private logger: Logger
  ) {}

  public async getUserIdxById(userId: string): Promise<string> {
    this.logger.silly(`[UserService] getUserIdxById ${userId}`);

    const idxList = await this.UserModel.findById(userId);
    if (idxList.length === 0)
      throw new APIError(
        "UserService",
        HttpStatusCode.BAD_REQUEST,
        "user not found"
      );
    return idxList[0].idx;
  }

  public async getUserInfo(
    userId: string
  ): Promise<{ id: string; nickname: string }> {
    this.logger.silly(`[UserService] getUserInfo ${userId}`);

    const user = await this.UserModel.findById(userId);
    if (user[0]?.idx === undefined)
      throw new APIError(
        "UserService",
        HttpStatusCode.BAD_REQUEST,
        "user not found"
      );
    return { id: user[0].id, nickname: user[0].nickname };
  }

  public async getUserPasswordQuestion(
    userId: string
  ): Promise<{ passwordQuestion: string }> {
    this.logger.silly(`[UserService] getUserPasswordQuestion ${userId}`);

    const user = await this.UserModel.findById(userId);
    if (user[0]?.idx === undefined)
      throw new APIError(
        "UserService",
        HttpStatusCode.BAD_REQUEST,
        "user not found"
      );
    return { passwordQuestion: user[0].passwordQuestion };
  }

  public async getRandomUserId(
    count: number
  ): Promise<{ users: { idx: string; id: string }[] }> {
    this.logger.silly(`[UserService] getRandomUserId count: ${count}`);

    const users = await this.UserModel.findRandomUser(count);
    return {
      users: users.map((user) => {
        return { idx: user.idx, id: user.id };
      }),
    };
  }

  public async deleteUserById(userId: string) {
    this.logger.silly(`[UserService] deleteUserById: ${userId}`);

    const user = await this.UserModel.findById(userId);
    if (user[0]?.idx === undefined)
      throw new APIError(
        "UserService",
        HttpStatusCode.BAD_REQUEST,
        "user not found"
      );

    const res = await this.UserModel.delete(user[0].idx);
    return res;
  }
}
