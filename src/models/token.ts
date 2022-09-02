import { saveDocumentWithId } from "./firebase";
import config from "@/config";

export default class TokenModel {
  COLLECTION = config.node_env == "test" ? "test_token" : "token";


  public async create(userIdx: string, token: string): Promise<void> {
    await saveDocumentWithId(this.COLLECTION, userIdx, { token });
  }
}
