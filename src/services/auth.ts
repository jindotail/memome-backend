import { Inject, Service } from "typedi";
import { Logger } from "winston";
import { IUserSignUpDTO } from "../interfaces/IUser";
import UserModel from "../models/user";
import * as jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import * as argon2 from "argon2";
import config from "../config";

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

    const result = await this.UserModel.create(
      { ...userSignUpDTO, password: hashedPassword },
      salt.toString("hex")
    );

    this.logger.silly("Generating JWT");
    const accessToken = this.generateToken(result.insertId, 60);
    const refreshToken = this.generateToken(result.insertId, 120);
    return { accessToken, refreshToken };
  }

  private generateToken(idx: number, days: number) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + days);

    this.logger.silly(`Sign JWT for userId: ${idx}`);
    return jwt.sign(
      {
        idx: idx,
        exp: exp.getTime() / 1000,
      },
      config.jwtSecret
    );
  }
}
