import { IToken } from "@/interfaces/IToken";

export default class TokenModel {
  tokenMap: Map<string, any> = new Map<string, IToken>();

  public create(userIdx: string, refreshToken: string): void {
    console.log(
      `[MockTokenModel] create userIdx: ${userIdx} comment: ${refreshToken}`
    );

    this.tokenMap.set(userIdx, {
      refresh_token: refreshToken,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }
}
