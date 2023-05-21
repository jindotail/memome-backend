import { makeIdx } from "../common/random";
import { IComment } from "../interfaces/IComment";
export default class CommentModel {
  commentMap = new Map<string, any>();

  public create(
    userIdx: string,
    comment: string,
    ip: string,
    owner: boolean
  ): void {
    console.log(
      `[MockCommentModel] create userIdx: ${userIdx} comment: ${comment}`
    );

    this.commentMap.set(makeIdx(21), {
      user_idx: userIdx,
      comment: comment,
      ip: ip,
      owner,
      iso_time: new Date().toISOString(),
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  public findByUserIdx(userIdx: string): IComment[] {
    console.log(`[MockCommentModel] find userIdx: ${userIdx}`);

    const result: IComment[] = [];
    for (const key of this.commentMap.keys()) {
      if (this.commentMap.get(key).user_idx !== userIdx) continue;
      const data = this.commentMap.get(key);
      result.push({ idx: key, owner: data.owner === true, ...data });
    }
    return result;
  }

  public find(idx: string): IComment | undefined {
    const data = this.commentMap.get(idx);
    if (this.commentMap.has(idx))
      return {
        idx,
        owner: data.owner === true,
        ...this.commentMap.get(idx),
      };
    return undefined;
  }

  public delete(idx: string): void {
    this.commentMap.delete(idx);
  }
}
