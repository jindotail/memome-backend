import { Inject, Service } from "typedi";
import { IUserSignUpDTO } from "../interfaces/IUser";
import UserModel from "../models/user";

@Service()
export default class AuthService {
  constructor(@Inject() private UserModel: UserModel) {}

  public async signUp(userSignUpDTO: IUserSignUpDTO) {
    const res = await this.UserModel.create(userSignUpDTO);
    return res;
  }
}
