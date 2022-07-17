import CommentModel from "../models/comment";
import UserModel from "../models/user";
import MockCommentModel from "../models/mock_comment";
import MockUserModel from "../models/mock_user";
import dependencyInjectorLoader from "./dependencyInjector";
import expressLoader from "./express";
import Logger from "./logger";
import config from "@/config";
import TokenModel from "@/models/token";

const getModelList = (
  userModel: any,
  commentModel: any,
  tokenModel: any
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

export default async ({ expressApp }) => {
  const modelList =
    config.node_env === "local"
      ? getModelList(
          new MockUserModel(),
          new MockCommentModel(),
          new TokenModel()
        )
      : getModelList(new UserModel(), new CommentModel(), new TokenModel());

  dependencyInjectorLoader({
    models: modelList,
  });

  Logger.info(`✌️ NODE_ENV: ${config.node_env}`);
  Logger.info("✌️ Dependency Injector loaded");

  expressLoader({ app: expressApp });
  Logger.info("✌️ Express loaded");
};
