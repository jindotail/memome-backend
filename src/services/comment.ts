import { Inject, Service } from "typedi";
import CommentModel from "../models/comment";

@Service()
export default class CommentService {
  constructor(@Inject() private commentModel: CommentModel) {}

  public async create(userIdx: number, comment: string) {
    const res = await this.commentModel.create(userIdx, comment);
    return res;
  }

  public async getComments(userIdx: number) {
    const res = await this.commentModel.find(userIdx);
    return res;
  }
}
