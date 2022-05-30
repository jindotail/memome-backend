import CommentModel from "../models/comment";
import UserModel from "../models/user";
import MockCommentModel from "../models/mock_comment";
import MockUserModel from "../models/mock_user";
import dependencyInjectorLoader from "./dependencyInjector";
import expressLoader from "./express";
import Logger from "./logger";
import config from "@/config";

const getModelList = (
  userModel: any,
  commentModel: any
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
  ];
};

export default async ({ expressApp }) => {
  const modelList =
    config.node_env === "dev"
      ? getModelList(new MockUserModel(), new MockCommentModel())
      : getModelList(new UserModel(), new CommentModel());

  dependencyInjectorLoader({
    models: modelList,
  });

  Logger.info(`✌️ NODE_ENV: ${config.node_env}`);
  Logger.info("✌️ Dependency Injector loaded");

  expressLoader({ app: expressApp });
  Logger.info("✌️ Express loaded");
};
