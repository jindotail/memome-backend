import CommentModel from "../models/comment";
import UserModel from "../models/user";
import dependencyInjectorLoader from "./dependencyInjector";
import expressLoader from "./express";
import Logger from "./logger";

export default async ({ expressApp }) => {
  const userModel = {
    name: "userModel",
    model: new UserModel(),
  };
  const commentModel = {
    name: "commentModel",
    model: new CommentModel(),
  };

  dependencyInjectorLoader({
    models: [userModel, commentModel],
  });
  Logger.info("✌️ Dependency Injector loaded");

  expressLoader({ app: expressApp });
  Logger.info("✌️ Express loaded");
};
