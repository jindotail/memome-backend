import UserModel from "@/models/user";
import CommentService from "@/services/comment";
import { celebrate, Joi } from "celebrate";
import { NextFunction, Request, Response, Router } from "express";
import { Container } from "typedi";
import { Logger } from "winston";
import middlewares from "../middlewares";

const route = Router();

export default (app: Router) => {
  app.use("/comment", route);
  app.use("/comment", middlewares.withError);

  const logger: Logger = Container.get("logger");
  const userModelInstance: UserModel = Container.get("userModel");
  const commentServiceInstance = Container.get(CommentService);

  const getUserIdxById = async (userId: string): Promise<number> => {
    const user = await userModelInstance.findById(userId);
    return user[0].idx;
  };

  route.post(
    "/:userId",
    celebrate({
      body: Joi.object({
        comment: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      logger.debug(
        `Calling post /comment/${req.params.userId} endpoint with body: %o`,
        req.body
      );

      try {
        const userIdx = await getUserIdxById(req.params.userId as string);
        const result = await commentServiceInstance.create(
          userIdx,
          req.body.comment
        );
        return res.status(201).json({
          body: result,
        });
      } catch (err) {
        return next(err);
      }
    }
  );

  route.get(
    "/:userId",
    async (req: Request, res: Response, next: NextFunction) => {
      logger.debug(`Calling get /comment/${req.params.userId} endpoint`);
      try {
        const userIdx = await getUserIdxById(req.params.userId as string);
        const result = await commentServiceInstance.getComments(userIdx);
        logger.silly(
          `[CommentRoute] getComments result: ${JSON.stringify(result)}`
        );
        return res.status(200).json({
          body: result,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
};
