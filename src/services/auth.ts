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
    if (userList[0] !== undefined)
      throw new APIError(
        "AuthService",
        HttpStatusCode.BAD_REQUEST,
        "duplicate user id"
      );

    this.logger.silly(`[AuthService] signUp ${JSON.stringify(userSignUpDTO)}`);
    const salt = randomBytes(10);
    this.logger.silly("Hashing password");
    const hashedPassword = await argon2.hash(userSignUpDTO.password, { salt });

    await this.UserModel.create(
      { ...userSignUpDTO, password: hashedPassword },
      salt.toString("hex")
    );
  }

  private async validatePassword(password: string, inputPassword: string) {
    this.logger.silly("Checking password");
    const validPassword = await argon2.verify(password, inputPassword);
    if (validPassword === false) {
      throw new APIError(
        "AuthService",
        HttpStatusCode.UNAUTHORIZED,
        "login failed"
      );
    }
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

    this.logger.silly("Password is valid!");
    this.logger.silly("Generating JWT");
    const accessToken = jwt.generateToken(user.id, config.accessTokenExpire);
    const refreshToken = jwt.generateToken(user.id, config.refreshTokenExpire);
    this.TokenModel.create(user.idx, refreshToken);

    return { accessToken, refreshToken };
  }
}
