import config from "@/config";
import { saveDocumentWithId } from "./firebase";

export default class TokenModel {
  COLLECTION = config.node_env == "test" ? "test_token" : "token";

  public async create(userIdx: string, token: string): Promise<void> {
    await saveDocumentWithId(this.COLLECTION, userIdx, { token });
  }
}
