import config from "../config";
import CommentModel from "../models/comment";
import MockCommentModel from "../models/mock_comment";
import MockTokenModel from "../models/mock_token";
import MockUserModel from "../models/mock_user";
import TokenModel from "../models/token";
import UserModel from "../models/user";
import dependencyInjectorLoader from "./dependencyInjector";
import expressLoader from "./express";
import Logger from "./logger";

const getModelList = (
  userModel: MockUserModel | UserModel,
  commentModel: MockCommentModel | CommentModel,
  tokenModel: MockTokenModel | TokenModel
): { name: string; model: any }[] => {
  return [
    {
      name: "userModel",
      model: userModel,
    },
    {
      name: "commentModel",
      model: commentModel,
    },
    {
      name: "tokenModel",
      model: tokenModel,
    },
  ];
};

const getModelListByEnv = (nodeEnv: string) => {
  if (nodeEnv === "local")
    return getModelList(
      new MockUserModel(),
      new MockCommentModel(),
      new MockTokenModel()
    );
  if (nodeEnv === "test")
    return getModelList(
      new UserModel("test_user"),
      new CommentModel("test_comment"),
      new TokenModel("test_token")
    );
  if (nodeEnv === "dev")
    return getModelList(
      new UserModel("dev_user"),
      new CommentModel("dev_comment"),
      new TokenModel("dev_token")
    );
  return getModelList(
    new UserModel("user"),
    new CommentModel("comment"),
    new TokenModel("token")
  );
};

export default async ({ expressApp }) => {
  const modelList = getModelListByEnv(config.phase);

  dependencyInjectorLoader({
    models: modelList,
  });

  Logger.info(`✌️ PHASE: ${config.phase}`);
  Logger.info("✌️ Dependency Injector loaded");

  expressLoader({ app: expressApp });
  Logger.info("✌️ Express loaded");
};
