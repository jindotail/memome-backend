import { Inject, Service } from "typedi";
import { Logger } from "winston";
import { HttpStatusCode } from "../common/http";
import APIError from "../errors/APIError";
import { IComment, ICommentResponse } from "../interfaces/IComment";
import CommentModel from "../models/comment";

@Service()
export default class CommentService {
  constructor(
    @Inject("commentModel") private commentModel: CommentModel,
    @Inject("logger") private logger: Logger
  ) {}

  public async create(userIdx: string, comment: string, ip: string) {
    this.logger.silly(
      `[CommentService] create userIdx: ${userIdx}, comment: ${comment}`
    );
    const res = await this.commentModel.create(userIdx, comment, ip);
    return res;
  }

  private convertCommentToCommentResponse(
    comments: IComment[]
  ): ICommentResponse[] {
    return comments.map((comment) => {
      return {
        idx: comment.idx,
        comment: comment.comment,
        iso_time: comment.iso_time,
      };
    });
  }

  private createTimeSort(a: IComment, b: IComment): number {
    if (a.created_at > b.created_at) return -1;
    else if (a.created_at < b.created_at) return 1;
    return 0;
  }

  private sliceComment(
    comment: IComment[],
    size: undefined | number
  ): IComment[] {
    if (size == undefined) return comment;
    return comment.splice(0, size);
  }

  public async getComments(
    userIdx: string,
    size: undefined | number
  ): Promise<ICommentResponse[]> {
    this.logger.silly(`[CommentService] getComments userIdx: ${userIdx}`);
    const comment = await this.commentModel.findByUserIdx(userIdx);
    const sortedComment = comment.sort((a, b) => this.createTimeSort(a, b));

    return this.convertCommentToCommentResponse(
      this.sliceComment(sortedComment, size)
    );
  }

  public async deleteCommentByIdx(idx: string): Promise<void> {
    this.logger.silly(`[CommentService] deleteCommentByIdx: ${idx}`);

    const comment = await this.commentModel.find(idx);
    if (comment === undefined) {
      throw new APIError(
        "CommentService",
        HttpStatusCode.BAD_REQUEST,
        "comment not found"
      );
    }

    await this.commentModel.delete(idx);
  }
}
