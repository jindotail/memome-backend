import { saveDocumentWithId } from "./firebase";

export default class TokenModel {
  COLLECTION = "token";

  public async create(userIdx: string, token: string): Promise<void> {
    saveDocumentWithId(this.COLLECTION, userIdx, { token });
  }
}
