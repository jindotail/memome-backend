import * as db from "../../../src/models/firebase";
import TokenModel from "../../../src/models/token";

describe("TokenModel", () => {
  const tokenModel = new TokenModel("test_token");

  const userIdx1: string = "userIdx1";
  const token1: string = "token1";
  const token2: string = "token2";

  afterEach(async () => {
    await db.deleteCollection("test_token");
  });

  test("create", async () => {
    await tokenModel.create(userIdx1, token1);
  });

  test("create - 존재하는 토큰 생성시 업데이트 한다", async () => {
    await tokenModel.create(userIdx1, token1);
    await tokenModel.create(userIdx1, token2);
  });
});
