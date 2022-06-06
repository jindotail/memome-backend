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
    this.logger.silly(`[UserService] signUp ${userId}`);

    const user = await this.UserModel.findById(userId);
    if (user[0]?.idx === undefined)
      throw new APIError(
        "UserService",
        HttpStatusCode.BAD_REQUEST,
        "user not found"
      );
    return user[0]?.idx;
  }
}
