import TokenModel from "../../../src/models/mock_token";

describe("TokenModel", () => {
  const tokenModel = new TokenModel();

  const userIdx1: string = "userIdx1";
  const token1: string = "token1";
  const token2: string = "token2";

  beforeEach(() => {
    tokenModel.tokenMap = new Map();
  });

  test("create", () => {
    tokenModel.create(userIdx1, token1);
  });

  test("create - 존재하는 토큰 생성시 업데이트 한다", () => {
    tokenModel.create(userIdx1, token1);
    tokenModel.create(userIdx1, token2);
  });
});
