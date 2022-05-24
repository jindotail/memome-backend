import { Inject, Service } from "typedi";
import UserModel from "../models/user";

@Service()
export default class AuthService {
  constructor(@Inject() private UserModel: UserModel) {}

  public async signUp(nickname: string) {
    const res = await this.UserModel.create(nickname);
    return res;
  }
}
