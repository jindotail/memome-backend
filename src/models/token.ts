import { saveDocumentWithId } from "./firebase";

export default class TokenModel {
  constructor(private collection: string) {}

  public async create(userIdx: string, token: string): Promise<void> {
    await saveDocumentWithId(this.collection, userIdx, { token });
  }
}
