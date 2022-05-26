import { ICommentResponse } from "@/interfaces/IComment";
import { Inject, Service } from "typedi";
import CommentModel from "../models/comment";

@Service()
export default class CommentService {
  constructor(
    @Inject("commentModel") private commentModel: CommentModel,
    @Inject("logger") private logger
  ) {}

  public async create(userIdx: number, comment: string) {
    this.logger.silly(
      `[CommentService] create userIdx: ${userIdx}, comment: ${comment}`
    );
    const res = await this.commentModel.create(userIdx, comment);
    return res;
  }

  public async getComments(userIdx: number): Promise<ICommentResponse[]> {
    this.logger.silly(`[CommentService] getComments userIdx: ${userIdx}`);
    const res = await this.commentModel.find(userIdx);
    return res.map((comment) => {
      return {
        comment: comment.comment,
        created_at: comment.created_at.getTime(),
      } as ICommentResponse;
    });
  }
}
