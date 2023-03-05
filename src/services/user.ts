import * as argon2 from "argon2";
import { Inject, Service } from "typedi";
import { Logger } from "winston";
import { HttpStatusCode } from "../common/http";
import {
  NICKNAME_MAX_LENGTH,
  NICKNAME_MIN_LENGTH,
  PW_MAX_LENGTH,
  PW_MIN_LENGTH,
  validationLength,
} from "../common/vallidation";
import APIError from "../errors/APIError";
import { ITheme } from "../interfaces/ITheme";
import { IUpdateUser } from "../interfaces/IUser";
import UserModel from "../models/user";
import { themeById } from "../services/theme";

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
  ): Promise<{ id: string; nickname: string; theme: ITheme }> {
    this.logger.silly(`[UserService] getUserInfo ${userId}`);

    const user = await this.UserModel.findById(userId);
    if (user[0]?.idx === undefined)
      throw new APIError(
        "UserService",
        HttpStatusCode.BAD_REQUEST,
        "user not found"
      );

    const theme = themeById(user[0].theme_id);

    return { id: user[0].id, nickname: user[0].nickname, theme };
  }

  public async getUserPasswordQuestion(userId: string): Promise<string> {
    this.logger.silly(`[UserService] getUserPasswordQuestion ${userId}`);

    const user = await this.UserModel.findById(userId);
    if (user[0]?.idx === undefined)
      throw new APIError(
        "UserService",
        HttpStatusCode.BAD_REQUEST,
        "user not found"
      );
    return user[0].passwordQuestion;
  }

  public async matchPasswordQuestionAndAnswer(
    userId: string,
    passwordAnswer: string
  ): Promise<boolean> {
    this.logger.silly(`[UserService] matchPasswordQuestionAndAnswer ${userId}`);

    const user = await this.UserModel.findById(userId);
    if (user[0]?.idx === undefined)
      throw new APIError(
        "UserService",
        HttpStatusCode.BAD_REQUEST,
        "user not found"
      );
    this.logger.debug(
      `답변: ${passwordAnswer}, 실제 답변: ${user[0].passwordAnswer}`
    );
    return passwordAnswer === user[0].passwordAnswer;
  }

  private async updateUserObj(body: any, salt: string): Promise<IUpdateUser> {
    let updateUser = {};
    this.logger.debug(`before updateUser: ${JSON.stringify(body)}`);

    const nickname = body.nickname;
    if (nickname !== undefined) {
      validationLength(nickname, NICKNAME_MIN_LENGTH, NICKNAME_MAX_LENGTH);
      updateUser = {
        ...updateUser,
        nickname,
      };
    }
    const password = body.password;
    if (password !== undefined) {
      validationLength(password, PW_MIN_LENGTH, PW_MAX_LENGTH);
      const hashedPassword = await argon2.hash(password, {
        salt: Buffer.from(salt, "hex"),
      });
      updateUser = {
        ...updateUser,
        password: hashedPassword,
      };
    }
    this.logger.debug(`updateUser: ${JSON.stringify(updateUser)}`);
    return updateUser;
  }

  public async updateUser(userId: string, body: any): Promise<void> {
    this.logger.silly(`[UserService] updateUser ${userId}, nickname: ${body}`);

    const user = await this.UserModel.findById(userId);
    if (user[0]?.idx === undefined)
      throw new APIError(
        "UserService",
        HttpStatusCode.BAD_REQUEST,
        "user not found"
      );
    const updateUser = await this.updateUserObj(body, user[0]?.salt);

    await this.UserModel.update(user[0].idx, updateUser);
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
