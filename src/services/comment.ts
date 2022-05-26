import { ICommentResponse } from "@/interfaces/IComment";
import { Inject, Service } from "typedi";
import CommentModel from "../models/comment";

@Service()
export default class CommentService {
  constructor(@Inject() private commentModel: CommentModel) {}

  public async create(userIdx: number, comment: string) {
    const res = await this.commentModel.create(userIdx, comment);
    return res;
  }

  public async getComments(userIdx: number): Promise<ICommentResponse[]> {
    const res = await this.commentModel.find(userIdx);
    return res.map((comment) => {
      return {
        comment: comment.comment,
        created_at: comment.created_at.getTime(),
      } as ICommentResponse;
    });
  }
}
