import { HttpStatusCode } from "@/common/http";
import APIError from "@/errors/APIError";
import CommentService from "@/services/comment";
import UserService from "@/services/user";
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
  const commentServiceInstance = Container.get(CommentService);
  const userServiceInstance = Container.get(UserService);

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
        const userIdx = await userServiceInstance.getUserIdxById(
          req.params.userId as string
        );
        const result = await commentServiceInstance.create(
          userIdx,
          req.body.comment
        );
        res.status(201).json({
          body: result,
        });
      } catch (err) {
        next(err);
      }
    }
  );

  route.get(
    "/:userId",
    async (req: Request, res: Response, next: NextFunction) => {
      logger.debug(`Calling get /comment/${req.params.userId} endpoint`);
      try {
        const userIdx = await userServiceInstance.getUserIdxById(
          req.params.userId as string
        );
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

  route.delete(
    "/:userId/:commentIdx",
    middlewares.checkToken,
    async (req: Request, res: Response, next: NextFunction) => {
      logger.debug(
        `Calling delete /comment/${req.params.userId}/${req.params.commentIdx} endpoint`
      );

      if (
        isNaN(Number(req.params.commentIdx)) === true ||
        Number(req.params.commentIdx) < 0
      )
        throw new APIError(
          "CommentRouter",
          HttpStatusCode.BAD_REQUEST,
          "invalid comment id"
        );

      try {
        commentServiceInstance.deleteCommentByIdx(req.params.commentIdx);

        return res.status(200).json({
          body: req.params.userId,
          idx: req.params.commentIdx,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
};
