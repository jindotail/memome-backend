import { Inject, Service } from "typedi";
import { IUserSignUpDTO } from "../interfaces/IUser";
import UserModel from "../models/user";

@Service()
export default class AuthService {
  constructor(
    @Inject() private UserModel: UserModel,
    @Inject("logger") private logger
  ) {}

  public async signUp(userSignUpDTO: IUserSignUpDTO) {
    this.logger.silly(`[AuthService] signUp ${JSON.stringify(userSignUpDTO)}`);
    const res = await this.UserModel.create(userSignUpDTO);
    return res;
  }
}
