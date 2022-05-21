import { Inject, Service } from "typedi";
import CommentModel from "../models/comment";

@Service()
export default class CommentService {
  constructor(@Inject() private commentModel: CommentModel) {}

  public create(comment: string) {
    const res = this.commentModel.create(comment);
    return res;
  }

  public getComments(userId: string) {
    const res = this.commentModel.find(userId);
    return res;
  }
}
