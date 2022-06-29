import { HttpStatusCode } from "@/common/http";
import APIError from "@/errors/APIError";
import { Inject, Service } from "typedi";
import { Logger } from "winston";
import UserModel from "../models/user";

@Service()
export default class UserService {
  constructor(
    @Inject("userModel") private UserModel: UserModel,
    @Inject("logger") private logger: Logger
  ) {}

  public async getUserIdxById(userId: string): Promise<number> {
    this.logger.silly(`[UserService] getUserIdxById ${userId}`);

    const user = await this.UserModel.findById(userId);
    if (user[0]?.idx === undefined)
      throw new APIError(
        "UserService",
        HttpStatusCode.BAD_REQUEST,
        "user not found"
      );
    return user[0]?.idx;
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

  public async getRandomUserId(count: number): Promise<{ ids: string[] }> {
    this.logger.silly(`[UserService] getRandomUserId count: ${count}`);

    const users = await this.UserModel.findRandomUser(count);
    return { ids: users.map((user) => user.id) };
  }

  public async deleteUserById(userId: string) {
    this.logger.silly(`[UserService] deleteUserById: ${userId}`);
    const res = await this.UserModel.disable(userId);
    return res;
  }
}
