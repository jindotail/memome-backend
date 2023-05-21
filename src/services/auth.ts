import * as argon2 from "argon2";
import { randomBytes } from "crypto";
import { Inject, Service } from "typedi";
import { Logger } from "winston";
import { HttpStatusCode } from "../common/http";
import * as jwt from "../common/jwt";
import config from "../config";
import APIError from "../errors/APIError";
import { IUserLoginDTO, IUserSignUpDTO } from "../interfaces/IUser";
import TokenModel from "../models/token";
import UserModel from "../models/user";

@Service()
export default class AuthService {
  constructor(
    @Inject("userModel") private UserModel: UserModel,
    @Inject("tokenModel") private TokenModel: TokenModel,
    @Inject("logger") private logger: Logger
  ) {}

  public async signUp(userSignUpDTO: IUserSignUpDTO): Promise<void> {
    const userList = await this.UserModel.findById(userSignUpDTO.id);
    if (userList.length !== 0)
      throw new APIError(
        "AuthService",
        HttpStatusCode.BAD_REQUEST,
        "duplicate user id"
      );

    this.logger.silly(`[AuthService] signUp ${JSON.stringify(userSignUpDTO)}`);
    const salt = randomBytes(10);
    const hashedPassword = await argon2.hash(userSignUpDTO.password, { salt });

    await this.UserModel.create(
      { ...userSignUpDTO, password: hashedPassword },
      salt.toString("hex")
    );
  }

  private async validatePassword(password: string, inputPassword: string) {
    this.logger.silly("Checking password");
    const isPasswordVaild = await argon2.verify(password, inputPassword);
    if (isPasswordVaild === false) {
      throw new APIError(
        "AuthService",
        HttpStatusCode.UNAUTHORIZED,
        "login failed"
      );
    }
    this.logger.silly("Password is valid!");
  }

  public generateToken(
    idx: string,
    id: string
  ): { accessToken: string; refreshToken: string } {
    this.logger.silly("Generating JWT");
    const accessToken = jwt.generateToken(id, config.accessTokenExpire);
    const refreshToken = jwt.generateToken(id, config.refreshTokenExpire);
    this.TokenModel.create(idx, refreshToken);

    return { accessToken, refreshToken };
  }

  public async login(userLoginDTO: IUserLoginDTO) {
    const userList = await this.UserModel.findById(userLoginDTO.id);
    const user = userList[0];
    if (user === undefined)
      throw new APIError(
        "AuthService",
        HttpStatusCode.UNAUTHORIZED,
        "login failed"
      );

    await this.validatePassword(user.password, userLoginDTO.password);
    return this.generateToken(user.idx, user.id);
  }
}
