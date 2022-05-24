import { Inject, Service } from "typedi";
import CommentModel from "../models/comment";

@Service()
export default class CommentService {
  constructor(@Inject() private commentModel: CommentModel) {}

  public async create(userId: number, comment: string) {
    const res = await this.commentModel.create(userId, comment);
    return res;
  }

  public async getComments(userId: number) {
    const res = await this.commentModel.find(userId);
    return res;
  }
}
