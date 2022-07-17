import { IToken } from "@/interfaces/IToken";

export default class CommentModel {
  tokenList: IToken[] = [];

  public async create(userIdx: number, refreshToken: string) {
    console.log(
      `[MockCommentModel] create userIdx: ${userIdx} comment: ${refreshToken}`
    );

    const filteredList = this.tokenList.filter((e) => e.user_idx == userIdx);

    if (filteredList.length === 0)
      this.tokenList.push({
        user_idx: userIdx,
        refresh_token: refreshToken,
        created_at: new Date(),
      });
    else
      this.tokenList = this.tokenList.map((e) => {
        if (e.user_idx !== userIdx) return e;
        return {
          user_idx: userIdx,
          refresh_token: refreshToken,
          created_at: new Date(),
        };
      });
  }
}
