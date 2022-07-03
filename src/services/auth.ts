import { HttpStatusCode } from "@/common/http";
import { generateToken } from "@/common/jwt";
import APIError from "@/errors/APIError";
import * as argon2 from "argon2";
import { randomBytes } from "crypto";
import { Inject, Service } from "typedi";
import { Logger } from "winston";
import { IUserLoginDTO, IUserSignUpDTO } from "../interfaces/IUser";
import UserModel from "../models/user";

@Service()
export default class AuthService {
  constructor(
    @Inject("userModel") private UserModel: UserModel,
    @Inject("logger") private logger: Logger
  ) {}

  public async signUp(userSignUpDTO: IUserSignUpDTO) {
    this.logger.silly(`[AuthService] signUp ${JSON.stringify(userSignUpDTO)}`);
    const salt = randomBytes(10);
    this.logger.silly("Hashing password");
    const hashedPassword = await argon2.hash(userSignUpDTO.password, { salt });

    try {
      await this.UserModel.create(
        { ...userSignUpDTO, password: hashedPassword },
        salt.toString("hex")
      );
    } catch (e) {
      if (e?.code === "ER_DUP_ENTRY") {
        throw new APIError(
          "AuthService",
          HttpStatusCode.BAD_REQUEST,
          "duplicate user id"
        );
      } else throw e;
    }
  }

  public async login(userLoginDTO: IUserLoginDTO) {
    const userList = await this.UserModel.findById(userLoginDTO.id);
    if (userList[0] === undefined)
      throw new APIError(
        "AuthService",
        HttpStatusCode.UNAUTHORIZED,
        "login failed"
      );
    const user = userList[0];

    this.logger.silly("Checking password");
    const validPassword = await argon2.verify(
      user.password,
      userLoginDTO.password
    );
    if (validPassword === false) {
      throw new APIError(
        "AuthService",
        HttpStatusCode.UNAUTHORIZED,
        "login failed"
      );
    }
    this.logger.silly("Password is valid!");
    this.logger.silly("Generating JWT");
    const accessToken = generateToken(user.idx, 60);
    const refreshToken = generateToken(user.idx, 120);
    return { accessToken, refreshToken };
  }
}
